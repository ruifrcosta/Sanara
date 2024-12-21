declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Substitua pelo seu ID do Google Analytics

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url
  });
};

export const event = ({
  action,
  category,
  label,
  value
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Eventos personalizados para a Sanara
export const trackConsultaAgendada = (especialidade: string) => {
  event({
    action: 'agendar_consulta',
    category: 'Telemedicina',
    label: especialidade
  });
};

export const trackPedidoFarmacia = (valor: number) => {
  event({
    action: 'realizar_pedido',
    category: 'Farmácia',
    label: 'Pedido Realizado',
    value: valor
  });
};

export const trackCotacaoSeguro = (tipo: string) => {
  event({
    action: 'solicitar_cotacao',
    category: 'Seguros',
    label: tipo
  });
};

export const trackBuscaMedicamento = (termo: string) => {
  event({
    action: 'buscar_medicamento',
    category: 'Farmácia',
    label: termo
  });
};

export const trackDownloadApp = (plataforma: 'ios' | 'android') => {
  event({
    action: 'download_app',
    category: 'App',
    label: plataforma
  });
};

export const trackContatoSuporte = (tipo: string) => {
  event({
    action: 'contato_suporte',
    category: 'Suporte',
    label: tipo
  });
};

export const trackNewsletterSignup = (origem: string) => {
  event({
    action: 'newsletter_signup',
    category: 'Marketing',
    label: origem
  });
};

export const trackCompartilhamento = (plataforma: string) => {
  event({
    action: 'compartilhar',
    category: 'Social',
    label: plataforma
  });
}; 