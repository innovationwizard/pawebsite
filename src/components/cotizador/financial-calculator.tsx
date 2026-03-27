"use client";

import { useState, useCallback } from "react";
import type { Currency } from "@/lib/types/database";

interface ProjectOption {
  id: string;
  name: string;
  starting_price: number | null;
  currency: Currency;
}

interface FinancialCalculatorProps {
  projectOptions: ProjectOption[];
}

interface CalculationResult {
  propertyValue: number;
  downPayment: number;
  amountToFinance: number;
  termYears: number;
  annualRate: number;
  monthlyPayment: number;
  currency: Currency;
}

const TERM_OPTIONS = [5, 10, 15, 20, 25];
const DEFAULT_ANNUAL_RATE = 7.26;

function formatCurrency(value: number, currency: Currency): string {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `Q${value.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
}

export function FinancialCalculator({ projectOptions }: FinancialCalculatorProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [termYears, setTermYears] = useState(20);
  const [currency, setCurrency] = useState<Currency>("GTQ");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");

  const handleProjectChange = useCallback(
    (projectId: string) => {
      setSelectedProjectId(projectId);
      const project = projectOptions.find((p) => p.id === projectId);
      if (project?.starting_price) {
        setPropertyValue(project.starting_price.toString());
        setCurrency(project.currency);
        setResult(null);
      }
    },
    [projectOptions]
  );

  const handleCalculate = useCallback(() => {
    setError("");
    setResult(null);

    const propValue = parseFloat(propertyValue.replace(/,/g, ""));
    const downPay = parseFloat(downPayment.replace(/,/g, ""));

    if (isNaN(propValue) || propValue <= 0) {
      setError("Ingresa un valor de inmueble v\u00e1lido.");
      return;
    }

    if (isNaN(downPay) || downPay < 0) {
      setError("Ingresa un monto de enganche v\u00e1lido.");
      return;
    }

    if (downPay >= propValue) {
      setError("El enganche debe ser menor al valor del inmueble.");
      return;
    }

    const amountToFinance = propValue - downPay;
    const monthly = calculateMonthlyPayment(amountToFinance, DEFAULT_ANNUAL_RATE, termYears);

    setResult({
      propertyValue: propValue,
      downPayment: downPay,
      amountToFinance,
      termYears,
      annualRate: DEFAULT_ANNUAL_RATE,
      monthlyPayment: monthly,
      currency,
    });
  }, [propertyValue, downPayment, termYears, currency]);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="font-heading text-2xl font-bold text-navy">
        Calculadora Financiera
      </h2>
      <p className="mt-2 text-sm text-gray">
        Estima tu cuota mensual de financiamiento bancario.
      </p>

      <div className="mt-8 space-y-6">
        {/* Project Selector */}
        {projectOptions.length > 0 && (
          <div>
            <label
              htmlFor="project-select"
              className="block text-sm font-medium text-navy"
            >
              Proyecto de inter&eacute;s (opcional)
            </label>
            <select
              id="project-select"
              value={selectedProjectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            >
              <option value="">Selecciona un proyecto</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Property Value */}
        <div>
          <label
            htmlFor="property-value"
            className="block text-sm font-medium text-navy"
          >
            Valor del inmueble ({currency === "USD" ? "$" : "Q."})
          </label>
          <input
            id="property-value"
            type="text"
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => {
              setPropertyValue(e.target.value);
              setResult(null);
            }}
            placeholder={currency === "USD" ? "150,000" : "1,500,000"}
            className="mt-2 w-full rounded-lg border border-gray/20 px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label
            htmlFor="down-payment"
            className="block text-sm font-medium text-navy"
          >
            Valor del enganche ({currency === "USD" ? "$" : "Q."})
          </label>
          <input
            id="down-payment"
            type="text"
            inputMode="decimal"
            value={downPayment}
            onChange={(e) => {
              setDownPayment(e.target.value);
              setResult(null);
            }}
            placeholder={currency === "USD" ? "30,000" : "300,000"}
            className="mt-2 w-full rounded-lg border border-gray/20 px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          />
        </div>

        {/* Term Selector */}
        <div>
          <label className="block text-sm font-medium text-navy">
            Plazo de financiamiento
          </label>
          <div className="mt-2 flex gap-2">
            {TERM_OPTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setTermYears(term);
                  setResult(null);
                }}
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  termYears === term
                    ? "bg-celeste text-white shadow-md"
                    : "border border-gray/20 text-gray hover:border-celeste hover:text-celeste"
                }`}
              >
                {term} a&ntilde;os
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}

        {/* Calculate Button */}
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-full bg-celeste px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-celeste/90 hover:shadow-lg"
        >
          Calcular Financiamiento
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8 rounded-xl bg-navy/5 p-6">
          <h3 className="font-heading text-lg font-bold text-navy">
            Resultado Estimado
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray">Valor del inmueble</span>
              <span className="font-medium text-navy">
                {formatCurrency(result.propertyValue, result.currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray">Enganche</span>
              <span className="font-medium text-navy">
                {formatCurrency(result.downPayment, result.currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray">Valor a financiar</span>
              <span className="font-medium text-navy">
                {formatCurrency(result.amountToFinance, result.currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray">Plazo</span>
              <span className="font-medium text-navy">
                {result.termYears} a&ntilde;os
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray">Tasa estimada anual</span>
              <span className="font-medium text-navy">
                {result.annualRate}%
              </span>
            </div>
            <div className="my-3 border-t border-navy/10" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray">
                Cuota mensual estimada
              </span>
              <span className="font-heading text-2xl font-bold text-celeste">
                {formatCurrency(result.monthlyPayment, result.currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
