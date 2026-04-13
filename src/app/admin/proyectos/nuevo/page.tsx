"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Database, ProjectType, ProjectStatus, Currency } from "@/lib/types/database";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

const projectTypeOptions = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
  { value: "mixed-use", label: "Uso Mixto" },
];

const statusOptions = [
  { value: "active", label: "En Venta" },
  { value: "nearly_sold_out", label: "Últimas Unidades" },
  { value: "sold_out", label: "Agotado" },
  { value: "delivered", label: "Entregado" },
  { value: "under_construction", label: "En Construcción" },
  { value: "frozen", label: "Próximamente" },
];

const currencyOptions = [
  { value: "GTQ", label: "GTQ - Quetzales" },
  { value: "USD", label: "USD - Dólares" },
];

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [slug, setSlug] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("vertical");
  const [currency, setCurrency] = useState<Currency>("GTQ");
  const [description, setDescription] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [towers, setTowers] = useState("");
  const [floorsPerTower, setFloorsPerTower] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("under_construction");
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [startingPrice, setStartingPrice] = useState("");
  const [startingPriceDisplay, setStartingPriceDisplay] = useState("");
  const [enganchePercent, setEnganchePercent] = useState("");
  const [reservaAmount, setReservaAmount] = useState("");
  const [reservaDisplay, setReservaDisplay] = useState("");
  const [cuotasEnganche, setCuotasEnganche] = useState("");
  const [maxPlazoYears, setMaxPlazoYears] = useState("");
  const [bankRateDisplay, setBankRateDisplay] = useState("");
  const [specialFeatures, setSpecialFeatures] = useState("");
  const [bedroomRange, setBedroomRange] = useState("");
  const [areaRangeM2, setAreaRangeM2] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isPublished, setIsPublished] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const data: ProjectInsert = {
      name,
      abbreviation,
      slug,
      project_type: projectType,
      currency,
      description: description || null,
      location_description: locationDescription || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      total_units: parseInt(totalUnits) || 0,
      towers: towers ? parseInt(towers) : null,
      floors_per_tower: floorsPerTower ? parseInt(floorsPerTower) : null,
      status,
      hero_image_url: heroImageUrl,
      hero_video_url: heroVideoUrl || null,
      logo_url: logoUrl,
      starting_price: startingPrice ? parseFloat(startingPrice) : null,
      starting_price_display: startingPriceDisplay || null,
      enganche_percent: enganchePercent ? parseFloat(enganchePercent) : null,
      reserva_amount: reservaAmount ? parseFloat(reservaAmount) : null,
      reserva_display: reservaDisplay || null,
      cuotas_enganche: cuotasEnganche ? parseInt(cuotasEnganche) : null,
      max_plazo_years: maxPlazoYears ? parseInt(maxPlazoYears) : null,
      bank_rate_display: bankRateDisplay || null,
      special_features: specialFeatures
        ? specialFeatures.split(",").map((s) => s.trim())
        : null,
      bedroom_range: bedroomRange || null,
      area_range_m2: areaRangeM2 || null,
      sort_order: parseInt(sortOrder) || 0,
      is_published: isPublished,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image_url: ogImageUrl || null,
    };

    const result = await createProject(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin/proyectos");
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/proyectos"
          className="inline-flex items-center text-sm text-gray hover:text-navy"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver a proyectos
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold text-navy">
          Nuevo Proyecto
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Información Básica
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="name"
              label="Nombre del proyecto"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
            <Input
              id="abbreviation"
              label="Abreviatura"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              required
            />
            <Input
              id="slug"
              label="Slug (URL)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <Select
              id="project_type"
              label="Tipo de proyecto"
              options={projectTypeOptions}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
            />
            <Select
              id="status"
              label="Estado"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            />
            <Select
              id="currency"
              label="Moneda"
              options={currencyOptions}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            />
            <Input
              id="total_units"
              label="Total de unidades"
              type="number"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              required
            />
            <Input
              id="towers"
              label="Torres"
              type="number"
              value={towers}
              onChange={(e) => setTowers(e.target.value)}
            />
            <Input
              id="floors_per_tower"
              label="Pisos por torre"
              type="number"
              value={floorsPerTower}
              onChange={(e) => setFloorsPerTower(e.target.value)}
            />
            <Input
              id="sort_order"
              label="Orden"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Textarea
              id="description"
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </section>

        {/* Ubicación */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Ubicación
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                id="location_description"
                label="Descripción de ubicación"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
              />
            </div>
            <Input
              id="latitude"
              label="Latitud"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <Input
              id="longitude"
              label="Longitud"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </section>

        {/* Imágenes */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Imágenes y Video
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploader
              bucket="project-images"
              currentUrl={heroImageUrl}
              onUpload={setHeroImageUrl}
              onRemove={() => setHeroImageUrl(null)}
              label="Imagen Hero"
            />
            <ImageUploader
              bucket="project-logos"
              currentUrl={logoUrl}
              onUpload={setLogoUrl}
              onRemove={() => setLogoUrl(null)}
              label="Logo del proyecto"
            />
          </div>
          <div className="mt-4">
            <Input
              id="hero_video_url"
              label="URL del video hero"
              value={heroVideoUrl}
              onChange={(e) => setHeroVideoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </section>

        {/* Precios y financiamiento */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Precios y Financiamiento
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="starting_price"
              label="Precio desde"
              type="number"
              step="0.01"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
            />
            <Input
              id="starting_price_display"
              label="Precio display (texto)"
              value={startingPriceDisplay}
              onChange={(e) => setStartingPriceDisplay(e.target.value)}
              placeholder="Desde Q1,200,000"
            />
            <Input
              id="enganche_percent"
              label="Enganche (%)"
              type="number"
              step="0.1"
              value={enganchePercent}
              onChange={(e) => setEnganchePercent(e.target.value)}
            />
            <Input
              id="reserva_amount"
              label="Monto de reserva"
              type="number"
              step="0.01"
              value={reservaAmount}
              onChange={(e) => setReservaAmount(e.target.value)}
            />
            <Input
              id="reserva_display"
              label="Reserva display (texto)"
              value={reservaDisplay}
              onChange={(e) => setReservaDisplay(e.target.value)}
              placeholder="Q5,000"
            />
            <Input
              id="cuotas_enganche"
              label="Cuotas de enganche"
              type="number"
              value={cuotasEnganche}
              onChange={(e) => setCuotasEnganche(e.target.value)}
            />
            <Input
              id="max_plazo_years"
              label="Plazo máximo (años)"
              type="number"
              value={maxPlazoYears}
              onChange={(e) => setMaxPlazoYears(e.target.value)}
            />
            <Input
              id="bank_rate_display"
              label="Tasa bancaria (texto)"
              value={bankRateDisplay}
              onChange={(e) => setBankRateDisplay(e.target.value)}
              placeholder="Desde 7.5%"
            />
          </div>
        </section>

        {/* Características */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Características
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="bedroom_range"
              label="Rango de habitaciones"
              value={bedroomRange}
              onChange={(e) => setBedroomRange(e.target.value)}
              placeholder="1-3 habitaciones"
            />
            <Input
              id="area_range_m2"
              label="Rango de área (m²)"
              value={areaRangeM2}
              onChange={(e) => setAreaRangeM2(e.target.value)}
              placeholder="45-120 m²"
            />
            <div className="sm:col-span-2">
              <Input
                id="special_features"
                label="Características especiales (separadas por coma)"
                value={specialFeatures}
                onChange={(e) => setSpecialFeatures(e.target.value)}
                placeholder="Piscina, Gimnasio, Rooftop"
              />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            SEO
          </h2>
          <div className="grid gap-4">
            <Input
              id="meta_title"
              label="Meta título"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
            <Textarea
              id="meta_description"
              label="Meta descripción"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
            />
            <Input
              id="og_image_url"
              label="URL imagen OG"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
            />
          </div>
        </section>

        {/* Publicación */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 rounded border-gray/30 text-celeste focus:ring-celeste/20"
            />
            <span className="text-sm font-medium text-navy">
              Publicar proyecto
            </span>
          </label>
        </section>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            Crear Proyecto
          </Button>
          <Link href="/admin/proyectos">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
