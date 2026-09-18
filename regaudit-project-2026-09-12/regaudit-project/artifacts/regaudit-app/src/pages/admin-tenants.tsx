import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { clearAdminKey, getAdminKey, setAdminKey } from '@/lib/admin-key';
import { adminApi, ApiError, type AccessStatus, type TenantListEntry } from '@/lib/api';

const ACCESS_LABELS: Record<AccessStatus, string> = {
  trialing: 'Essai en cours',
  active: 'Abonnement actif',
  grace: 'Délai de grâce',
  expired: 'Expiré',
  canceled: 'Résilié',
};

const ACCESS_BADGE_VARIANT: Record<AccessStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  trialing: 'secondary',
  active: 'default',
  grace: 'outline',
  expired: 'destructive',
  canceled: 'destructive',
};

function AdminKeyGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Accès administrateur APEX SKY</CardTitle>
        <CardDescription>
          Saisissez la clé d'administration pour gérer les régulateurs (tenants). Solution
          d'interim en attendant l'authentification par compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex gap-2"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            if (!value.trim()) return;
            setAdminKey(value.trim());
            onUnlock();
          }}
        >
          <Input
            type="password"
            placeholder="Clé d'administration"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            data-testid="input-admin-key"
          />
          <Button type="submit" data-testid="button-unlock-admin">
            Valider
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateTenantForm({ adminKey }: { adminKey: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [brandColor, setBrandColor] = useState('#f97316');

  const createTenant = useMutation({
    mutationFn: () =>
      adminApi.createTenant(
        {
          name,
          subdomain,
          contactEmail: contactEmail || undefined,
          logoUrl: logoUrl || undefined,
          brandColor,
        },
        adminKey,
      ),
    onSuccess: (result) => {
      toast({
        title: 'Régulateur créé',
        description: `${result.tenant.name} — essai gratuit jusqu'au ${new Date(result.trialEndsAt).toLocaleDateString('fr-FR')}.`,
      });
      setName('');
      setSubdomain('');
      setContactEmail('');
      setLogoUrl('');
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError && error.body && typeof error.body === 'object' && 'message' in error.body
          ? String((error.body as { message?: unknown }).message)
          : 'Une erreur est survenue.';
      toast({ title: 'Échec de la création', description: message, variant: 'destructive' });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un régulateur</CardTitle>
        <CardDescription>
          Démarre automatiquement son essai gratuit de 3 mois. Le sous-domaine choisi sera
          accessible en <code>https://{subdomain || '…'}.myplatform.com</code> une fois le DNS
          configuré.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            createTenant.mutate();
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="tenant-name">Nom du régulateur</Label>
            <Input
              id="tenant-name"
              placeholder="ARMP"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              data-testid="input-tenant-name"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tenant-subdomain">Sous-domaine</Label>
            <Input
              id="tenant-subdomain"
              placeholder="armp"
              value={subdomain}
              onChange={(event) => setSubdomain(event.target.value.toLowerCase())}
              required
              data-testid="input-tenant-subdomain"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tenant-contact">E-mail de contact (optionnel)</Label>
            <Input
              id="tenant-contact"
              type="email"
              placeholder="contact@armp.ci"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              data-testid="input-tenant-contact"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tenant-logo">URL du logo (optionnel)</Label>
            <Input
              id="tenant-logo"
              type="url"
              placeholder="https://…/logo.png"
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
              data-testid="input-tenant-logo"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tenant-color">Couleur de marque</Label>
            <div className="flex items-center gap-2">
              <input
                id="tenant-color"
                type="color"
                className="h-9 w-14 rounded-md border border-input"
                value={brandColor}
                onChange={(event) => setBrandColor(event.target.value)}
                data-testid="input-tenant-color"
              />
              <span className="text-sm text-muted-foreground">{brandColor}</span>
            </div>
          </div>
          <Button type="submit" disabled={createTenant.isPending} data-testid="button-create-tenant">
            {createTenant.isPending ? 'Création…' : 'Créer le régulateur'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TenantRow({ entry }: { entry: TenantListEntry }) {
  const { tenant, access } = entry;
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4" data-testid={`row-tenant-${tenant.subdomain}`}>
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 shrink-0 rounded-full border"
          style={{ backgroundColor: tenant.brandColor ?? undefined }}
        />
        <div>
          <p className="font-medium leading-tight">{tenant.name}</p>
          <p className="text-sm text-muted-foreground">{tenant.subdomain}.myplatform.com</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {access && (
          <span className="text-sm text-muted-foreground">
            {access.daysRemaining > 0
              ? `${access.daysRemaining} j restants`
              : new Date(access.effectiveUntil).toLocaleDateString('fr-FR')}
          </span>
        )}
        <Badge variant={access ? ACCESS_BADGE_VARIANT[access.status] : 'outline'}>
          {access ? ACCESS_LABELS[access.status] : 'Aucun abonnement'}
        </Badge>
      </div>
    </div>
  );
}

function TenantList({ adminKey }: { adminKey: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: () => adminApi.listTenants(adminKey),
    retry: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Régulateurs</CardTitle>
        <CardDescription>Tous les tenants provisionnés sur la plateforme.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {isError && (
          <p className="text-sm text-destructive">
            Impossible de charger les régulateurs (base de données indisponible ou clé invalide).
          </p>
        )}
        {data?.tenants.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun régulateur pour l'instant.</p>
        )}
        {data?.tenants.map((entry) => (
          <TenantRow key={entry.tenant.id} entry={entry} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminTenants() {
  const [adminKey, setLocalAdminKey] = useState<string | null>(() => getAdminKey());

  if (!adminKey) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
        <AdminKeyGate onUnlock={() => setLocalAdminKey(getAdminKey())} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Console APEX SKY</h1>
            <p className="text-sm text-muted-foreground">Provisioning des régulateurs (tenants)</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearAdminKey();
              setLocalAdminKey(null);
            }}
            data-testid="button-lock-admin"
          >
            Verrouiller
          </Button>
        </div>
        <CreateTenantForm adminKey={adminKey} />
        <TenantList adminKey={adminKey} />
      </div>
    </div>
  );
}
