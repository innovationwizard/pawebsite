interface ProjectLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  name: string;
  location_description: string | null;
}

export function ProjectLocationMap({
  latitude,
  longitude,
  name,
  location_description,
}: ProjectLocationMapProps) {
  if (!latitude || !longitude) return null;

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sgt`;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
          Ubicación
        </h2>
        {location_description && (
          <p className="mt-2 text-gray">{location_description}</p>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl">
          <iframe
            src={mapSrc}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Ubicación de ${name}`}
          />
        </div>
      </div>
    </section>
  );
}
