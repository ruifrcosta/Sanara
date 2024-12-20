export function Integrations() {
  return (
    <section className="bg-surface-variant py-24">
      <div className="mx-auto max-w-[1440px] px-[156px]">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-archivo text-4xl font-bold text-secondary">
            Seamless Integrations
          </h2>
          <p className="text-lg text-text-secondary">
            Connect with Your Favorite Tools and Services
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-4 gap-8">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-custom-sm transition-shadow hover:shadow-custom-md"
            >
              <div className="mb-6 h-16 w-16">
                <img
                  src={integration.logo}
                  alt={`${integration.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mb-2 font-archivo text-xl font-bold text-secondary">
                {integration.name}
              </h3>
              <p className="text-text-secondary">{integration.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const integrations = [
  {
    name: 'Google Calendar',
    description: 'Sync your appointments and schedules',
    logo: '/images/integrations/google-calendar.svg',
  },
  {
    name: 'Stripe',
    description: 'Process payments securely',
    logo: '/images/integrations/stripe.svg',
  },
  {
    name: 'Slack',
    description: 'Get real-time notifications',
    logo: '/images/integrations/slack.svg',
  },
  {
    name: 'Zoom',
    description: 'Host virtual meetings',
    logo: '/images/integrations/zoom.svg',
  },
  {
    name: 'Microsoft Teams',
    description: 'Collaborate with your team',
    logo: '/images/integrations/teams.svg',
  },
  {
    name: 'Dropbox',
    description: 'Store and share files',
    logo: '/images/integrations/dropbox.svg',
  },
  {
    name: 'WhatsApp',
    description: 'Send instant messages',
    logo: '/images/integrations/whatsapp.svg',
  },
  {
    name: 'Gmail',
    description: 'Send and receive emails',
    logo: '/images/integrations/gmail.svg',
  },
] 