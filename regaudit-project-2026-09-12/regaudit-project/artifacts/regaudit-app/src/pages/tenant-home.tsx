import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError, fetchTenantMe, type AccessStatus } from '@/lib/api';

const ACCESS_BANNER: Record<AccessStatus, { label: string; tone: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  trialing: { label: 'Essai gratuit en cours', tone: 'secondary' },
  active: { label: 'Abonnement actif', tone: 'default' },
  grace: { label: 'Délai de grâce — pensez à renouveler', tone: 'outline' },
  expired: { label: 'Accès expiré', tone: 'destructive' },
  canceled: { label: 'Abonnement résilié', tone: 'destructive' },
};

const TILES = [
  { title: 'Apprendre', description: 'Modules de formation Audit & Contrôle AIRMS.' },
  { title: 'Simuler', description: "S'entraîner comme si l'auditeur était là." },
  { title: 'Manager', description: 'Scénarios de management et de leadership.' },
];

function PlatformLanding() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">RegAudit</h1>
        <p className="text-muted-foreground">
          Plateforme de préparation aux contrôles réglementaires, opérée par APEX SKY. Ce domaine
          ne correspond à aucun régulateur — chaque régulateur accède à son propre espace via son
          sous-domaine dédié.
        </p>
        <Link href="/admin" className="text-primary underline underline-offset-4">
          Console APEX SKY
        </Link>
      </div>
    </div>
  );
}

export default function TenantHome() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenant-me'],
    queryFn: fetchTenantMe,
    retry: false,
  });

  if (isLoading) {
    return <div className="min-h-screen w-full bg-background" />;
  }

  if (error) {
    if (error instanceof ApiError && error.status === 404) {
      return <PlatformLanding />;
    }
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
        <p className="text-destructive">
          Impossible de contacter la plateforme pour le moment. Réessayez dans un instant.
        </p>
      </div>
    );
  }

  if (!data) {
    return <PlatformLanding />;
  }

  const { tenant, access } = data;
  const banner = access ? ACCESS_BANNER[access.status] : null;

  return (
    <div className="min-h-screen w-full bg-background">
      <header
        className="flex items-center justify-between gap-4 px-6 py-4 text-white"
        style={{ backgroundColor: tenant.brandColor ?? 'hsl(var(--primary))' }}
      >
        <div className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-9 w-9 rounded-full bg-white object-contain p-1" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold leading-tight">{tenant.name}</p>
            <p className="text-xs text-white/80">Formation RegAudit — opéré par APEX SKY</p>
          </div>
        </div>
        {banner && (
          <Badge variant={banner.tone} data-testid="badge-access-status">
            {banner.label}
            {access && access.daysRemaining > 0 ? ` · ${access.daysRemaining} j` : ''}
          </Badge>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Bienvenue sur votre espace de préparation AIRMS</h1>
          <p className="text-muted-foreground">
            Cet espace appartient à {tenant.name}. Les données de votre organisation restent
            séparées de celles des autres régulateurs.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TILES.map((tile) => (
            <Card key={tile.title} className="opacity-90">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {tile.title}
                  <Badge variant="outline">Bientôt</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tile.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          RegAudit est un outil de formation d'APEX SKY ; ce n'est pas une certification officielle
          de l'AIRMS.
        </p>
      </main>
    </div>
  );
}
