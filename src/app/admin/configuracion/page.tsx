"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateSiteSetting } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Json } from "@/lib/types/database";

interface SettingsMap {
  [key: string]: Json;
}

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [successSection, setSuccessSection] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Hero video
  const [heroVideoUrl, setHeroVideoUrl] = useState("");

  // Brand highlights
  const [highlight1Label, setHighlight1Label] = useState("");
  const [highlight1Value, setHighlight1Value] = useState("");
  const [highlight2Label, setHighlight2Label] = useState("");
  const [highlight2Value, setHighlight2Value] = useState("");
  const [highlight3Label, setHighlight3Label] = useState("");
  const [highlight3Value, setHighlight3Value] = useState("");
  const [highlight4Label, setHighlight4Label] = useState("");
  const [highlight4Value, setHighlight4Value] = useState("");

  // Tertiary banner
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerCtaText, setBannerCtaText] = useState("");
  const [bannerCtaLink, setBannerCtaLink] = useState("");

  // Company info
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Social links
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  // Homepage section images
  const [teamImageUrl, setTeamImageUrl] = useState<string | null>(null);
  const [capsula1Url, setCapsula1Url] = useState<string | null>(null);
  const [capsula2Url, setCapsula2Url] = useState<string | null>(null);
  const [capsula3Url, setCapsula3Url] = useState<string | null>(null);

  // Team members (Quiénes Somos)
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; title: string; photo_url: string; bio: string }>>([]);

  // Lic. Puertas avatar
  const [licPuertasPhoto, setLicPuertasPhoto] = useState<string | null>(null);
  const [licPuertasName, setLicPuertasName] = useState("");
  const [licPuertasTitle, setLicPuertasTitle] = useState("");

  // Legal
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsConditions, setTermsConditions] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");

      const map: SettingsMap = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((data as any[]) ?? []).forEach((row: { key: string; value: Json }) => {
        map[row.key] = row.value;
      });

      setSettings(map);

      // Hero video — stored as { url: "..." } per schema
      setHeroVideoUrl(asObjString(asObj(map.hero_video_url), "url"));

      // Brand highlights
      const highlights = asArray(map.brand_highlights);
      if (highlights.length >= 1) {
        setHighlight1Label(asObjString(highlights[0], "label"));
        setHighlight1Value(asObjString(highlights[0], "value"));
      }
      if (highlights.length >= 2) {
        setHighlight2Label(asObjString(highlights[1], "label"));
        setHighlight2Value(asObjString(highlights[1], "value"));
      }
      if (highlights.length >= 3) {
        setHighlight3Label(asObjString(highlights[2], "label"));
        setHighlight3Value(asObjString(highlights[2], "value"));
      }
      if (highlights.length >= 4) {
        setHighlight4Label(asObjString(highlights[3], "label"));
        setHighlight4Value(asObjString(highlights[3], "value"));
      }

      // Tertiary banner
      const banner = asObj(map.tertiary_banner);
      setBannerImage(asObjString(banner, "image_url") || null);
      setBannerTitle(asObjString(banner, "title"));
      setBannerCtaText(asObjString(banner, "cta_text"));
      setBannerCtaLink(asObjString(banner, "cta_link"));

      // Company info
      const company = asObj(map.company_info);
      setAddress(asObjString(company, "address"));
      setEmail(asObjString(company, "email"));
      setPhone(asObjString(company, "phone"));
      setWhatsapp(asObjString(company, "whatsapp"));

      // Social links
      const social = asObj(map.social_links);
      setFacebook(asObjString(social, "facebook"));
      setInstagram(asObjString(social, "instagram"));
      setLinkedin(asObjString(social, "linkedin"));
      setYoutube(asObjString(social, "youtube"));

      // Homepage section images
      const sectionImgs = asObj(map.homepage_section_images);
      setTeamImageUrl(asObjString(sectionImgs, "team_image_url") || null);
      setCapsula1Url(asObjString(sectionImgs, "capsula_1_url") || null);
      setCapsula2Url(asObjString(sectionImgs, "capsula_2_url") || null);
      setCapsula3Url(asObjString(sectionImgs, "capsula_3_url") || null);

      // Team members
      const members = asArray(map.team_members);
      setTeamMembers(
        members.map((m) => ({
          name: asObjString(m, "name"),
          title: asObjString(m, "title"),
          photo_url: asObjString(m, "photo_url"),
          bio: asObjString(m, "bio"),
        }))
      );

      // Lic. Puertas
      const licPuertas = asObj(map.lic_puertas);
      setLicPuertasPhoto(asObjString(licPuertas, "photo_url") || null);
      setLicPuertasName(asObjString(licPuertas, "name"));
      setLicPuertasTitle(asObjString(licPuertas, "title"));

      // Legal
      setPrivacyPolicy(asString(map.privacy_policy));
      setTermsConditions(asString(map.terms_conditions));

      setIsLoading(false);
    }
    fetchSettings();
  }, []);

  function asString(val: Json | undefined): string {
    if (typeof val === "string") return val;
    return "";
  }

  function asArray(val: Json | undefined): Json[] {
    if (Array.isArray(val)) return val;
    return [];
  }

  function asObj(val: Json | undefined): Record<string, Json | undefined> {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return val as Record<string, Json | undefined>;
    }
    return {};
  }

  function asObjString(obj: Json | Record<string, Json | undefined>, key: string): string {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      const val = (obj as Record<string, Json | undefined>)[key];
      if (typeof val === "string") return val;
    }
    return "";
  }

  async function saveSection(sectionKey: string, key: string, value: Json) {
    setErrorMessage("");
    setSuccessSection(null);
    setSavingSection(sectionKey);

    const result = await updateSiteSetting(key, value);

    if (result.error) {
      setErrorMessage(result.error);
      setSavingSection(null);
      return;
    }

    setSuccessSection(sectionKey);
    setSavingSection(null);
    setTimeout(() => setSuccessSection(null), 3000);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-celeste border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">
          Configuración del Sitio
        </h1>
        <p className="mt-1 text-sm text-gray">
          Ajustes generales del sitio web.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="space-y-8">
        {/* Hero Video */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Video Hero
            </h2>
            {successSection === "hero_video" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <Input
            id="hero_video_url"
            label="URL del video hero"
            value={heroVideoUrl}
            onChange={(e) => setHeroVideoUrl(e.target.value)}
            placeholder="https://..."
          />
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "hero_video"}
              onClick={() => saveSection("hero_video", "hero_video_url", { url: heroVideoUrl })}
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Brand Highlights */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Números Destacados
            </h2>
            {successSection === "brand_highlights" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="h1_value"
                label="Número 1 - Valor"
                value={highlight1Value}
                onChange={(e) => setHighlight1Value(e.target.value)}
                placeholder="20+"
              />
              <Input
                id="h1_label"
                label="Número 1 - Etiqueta"
                value={highlight1Label}
                onChange={(e) => setHighlight1Label(e.target.value)}
                placeholder="Años de experiencia"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="h2_value"
                label="Número 2 - Valor"
                value={highlight2Value}
                onChange={(e) => setHighlight2Value(e.target.value)}
                placeholder="5,000+"
              />
              <Input
                id="h2_label"
                label="Número 2 - Etiqueta"
                value={highlight2Label}
                onChange={(e) => setHighlight2Label(e.target.value)}
                placeholder="Familias felices"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="h3_value"
                label="Número 3 - Valor"
                value={highlight3Value}
                onChange={(e) => setHighlight3Value(e.target.value)}
                placeholder="15"
              />
              <Input
                id="h3_label"
                label="Número 3 - Etiqueta"
                value={highlight3Label}
                onChange={(e) => setHighlight3Label(e.target.value)}
                placeholder="Proyectos"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="h4_value"
                label="Número 4 - Valor"
                value={highlight4Value}
                onChange={(e) => setHighlight4Value(e.target.value)}
                placeholder="100%"
              />
              <Input
                id="h4_label"
                label="Número 4 - Etiqueta"
                value={highlight4Label}
                onChange={(e) => setHighlight4Label(e.target.value)}
                placeholder="Proyectos entregados"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "brand_highlights"}
              onClick={() =>
                saveSection("brand_highlights", "brand_highlights", [
                  { label: highlight1Label, value: highlight1Value },
                  { label: highlight2Label, value: highlight2Value },
                  { label: highlight3Label, value: highlight3Value },
                  { label: highlight4Label, value: highlight4Value },
                ])
              }
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Tertiary Banner */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Banner Terciario
            </h2>
            {successSection === "tertiary_banner" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <div className="grid gap-4">
            <ImageUploader
              bucket="site-assets"
              currentUrl={bannerImage}
              onUpload={setBannerImage}
              onRemove={() => setBannerImage(null)}
              label="Imagen del banner"
            />
            <Input
              id="banner_title"
              label="Título"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="banner_cta_text"
                label="Texto del botón CTA"
                value={bannerCtaText}
                onChange={(e) => setBannerCtaText(e.target.value)}
              />
              <Input
                id="banner_cta_link"
                label="Enlace del CTA"
                value={bannerCtaLink}
                onChange={(e) => setBannerCtaLink(e.target.value)}
                placeholder="/contacto"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "tertiary_banner"}
              onClick={() =>
                saveSection("tertiary_banner", "tertiary_banner", {
                  image_url: bannerImage ?? "",
                  title: bannerTitle,
                  cta_text: bannerCtaText,
                  cta_link: bannerCtaLink,
                })
              }
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Company Info */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Información de la Empresa
            </h2>
            {successSection === "company_info" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                id="address"
                label="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Input
              id="company_email"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="phone"
              label="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              id="whatsapp"
              label="WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+502 1234 5678"
            />
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "company_info"}
              onClick={() =>
                saveSection("company_info", "company_info", {
                  address,
                  email,
                  phone,
                  whatsapp,
                })
              }
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Social Links */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Redes Sociales
            </h2>
            {successSection === "social_links" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="facebook"
              label="Facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
            />
            <Input
              id="instagram"
              label="Instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
            />
            <Input
              id="linkedin"
              label="LinkedIn"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/..."
            />
            <Input
              id="youtube"
              label="YouTube"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "social_links"}
              onClick={() =>
                saveSection("social_links", "social_links", {
                  facebook,
                  instagram,
                  linkedin,
                  youtube,
                })
              }
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Homepage Section Images */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-navy">
                Imágenes de Secciones (Página Principal)
              </h2>
              <p className="mt-1 text-xs text-gray">
                Imágenes del equipo y cápsulas informativas en la sección ¿Por qué Puerta Abierta?
              </p>
            </div>
            {successSection === "homepage_section_images" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploader
              bucket="site-assets"
              currentUrl={teamImageUrl}
              onUpload={setTeamImageUrl}
              onRemove={() => setTeamImageUrl(null)}
              label="Imagen del equipo (sección ¿Por qué?)"
            />
            <ImageUploader
              bucket="site-assets"
              currentUrl={capsula1Url}
              onUpload={setCapsula1Url}
              onRemove={() => setCapsula1Url(null)}
              label="Cápsula 1 — Los mejores en lo que hacemos"
            />
            <ImageUploader
              bucket="site-assets"
              currentUrl={capsula2Url}
              onUpload={setCapsula2Url}
              onRemove={() => setCapsula2Url(null)}
              label="Cápsula 2 — Atención personalizada"
            />
            <ImageUploader
              bucket="site-assets"
              currentUrl={capsula3Url}
              onUpload={setCapsula3Url}
              onRemove={() => setCapsula3Url(null)}
              label="Cápsula 3 — Alianzas pensadas para ti"
            />
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "homepage_section_images"}
              onClick={() =>
                saveSection("homepage_section_images", "homepage_section_images", {
                  team_image_url: teamImageUrl ?? "",
                  capsula_1_url: capsula1Url ?? "",
                  capsula_2_url: capsula2Url ?? "",
                  capsula_3_url: capsula3Url ?? "",
                })
              }
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Team Members */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-navy">
                Equipo (Quiénes Somos)
              </h2>
              <p className="mt-1 text-xs text-gray">
                Miembros del equipo que aparecen en la página Quiénes Somos.
              </p>
            </div>
            {successSection === "team_members" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>

          <div className="space-y-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="rounded-xl border border-gray/10 bg-off-white p-4">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm font-semibold text-navy">
                    Miembro {idx + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTeamMembers((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ImageUploader
                    bucket="site-assets"
                    currentUrl={member.photo_url || null}
                    onUpload={(url) =>
                      setTeamMembers((prev) =>
                        prev.map((m, i) => (i === idx ? { ...m, photo_url: url } : m))
                      )
                    }
                    onRemove={() =>
                      setTeamMembers((prev) =>
                        prev.map((m, i) => (i === idx ? { ...m, photo_url: "" } : m))
                      )
                    }
                    label="Foto"
                  />
                  <div className="space-y-3">
                    <Input
                      id={`member_name_${idx}`}
                      label="Nombre"
                      value={member.name}
                      onChange={(e) =>
                        setTeamMembers((prev) =>
                          prev.map((m, i) => (i === idx ? { ...m, name: e.target.value } : m))
                        )
                      }
                      placeholder="Lic. María García"
                    />
                    <Input
                      id={`member_title_${idx}`}
                      label="Cargo"
                      value={member.title}
                      onChange={(e) =>
                        setTeamMembers((prev) =>
                          prev.map((m, i) => (i === idx ? { ...m, title: e.target.value } : m))
                        )
                      }
                      placeholder="Directora Comercial"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea
                      id={`member_bio_${idx}`}
                      label="Bio (opcional)"
                      value={member.bio}
                      onChange={(e) =>
                        setTeamMembers((prev) =>
                          prev.map((m, i) => (i === idx ? { ...m, bio: e.target.value } : m))
                        )
                      }
                      rows={2}
                      placeholder="Breve descripción del miembro del equipo..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setTeamMembers((prev) => [
                  ...prev,
                  { name: "", title: "", photo_url: "", bio: "" },
                ])
              }
              className="w-full rounded-xl border-2 border-dashed border-gray/20 py-3 text-sm font-medium text-gray transition-colors hover:border-celeste hover:text-celeste"
            >
              + Agregar miembro del equipo
            </button>
          </div>

          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "team_members"}
              onClick={() => saveSection("team_members", "team_members", teamMembers)}
            >
              Guardar equipo
            </Button>
          </div>
        </section>

        {/* Lic. Puertas Avatar */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-navy">
                Lic. Puertas — Avatar IA
              </h2>
              <p className="mt-1 text-xs text-gray">
                Foto y datos que aparecen en la tarjeta de llamada en la página principal.
              </p>
            </div>
            {successSection === "lic_puertas" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <div className="grid gap-4">
            <ImageUploader
              bucket="site-assets"
              currentUrl={licPuertasPhoto}
              onUpload={setLicPuertasPhoto}
              onRemove={() => setLicPuertasPhoto(null)}
              label="Foto de Lic. Puertas"
            />
            <Input
              id="lic_puertas_name"
              label="Nombre completo"
              value={licPuertasName}
              onChange={(e) => setLicPuertasName(e.target.value)}
              placeholder="Lic. Carlos Puertas"
            />
            <Input
              id="lic_puertas_title"
              label="Cargo / Título"
              value={licPuertasTitle}
              onChange={(e) => setLicPuertasTitle(e.target.value)}
              placeholder="Asesor Senior"
            />
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "lic_puertas"}
              onClick={() =>
                saveSection("lic_puertas", "lic_puertas", {
                  photo_url: licPuertasPhoto ?? "",
                  name: licPuertasName,
                  title: licPuertasTitle,
                })
              }
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Política de Privacidad
            </h2>
            {successSection === "privacy_policy" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <Textarea
            id="privacy_policy"
            label="Contenido HTML"
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            rows={12}
            placeholder="<h2>Política de Privacidad</h2><p>...</p>"
          />
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "privacy_policy"}
              onClick={() => saveSection("privacy_policy", "privacy_policy", privacyPolicy)}
            >
              Guardar
            </Button>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Términos y Condiciones
            </h2>
            {successSection === "terms_conditions" && (
              <span className="text-sm text-green-600">Guardado</span>
            )}
          </div>
          <Textarea
            id="terms_conditions"
            label="Contenido HTML"
            value={termsConditions}
            onChange={(e) => setTermsConditions(e.target.value)}
            rows={12}
            placeholder="<h2>Términos y Condiciones</h2><p>...</p>"
          />
          <div className="mt-4">
            <Button
              size="sm"
              isLoading={savingSection === "terms_conditions"}
              onClick={() => saveSection("terms_conditions", "terms_conditions", termsConditions)}
            >
              Guardar
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
