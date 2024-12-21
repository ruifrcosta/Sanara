export const defaultTemplates = [
  {
    name: 'appointment-reminder',
    description: 'Template for appointment reminder notifications',
    type: 'EMAIL',
    subject: 'Lembrete de Consulta - Sanara',
    content: `
      <h2>Lembrete de Consulta</h2>
      <p>Olá,</p>
      <p>Esta é uma mensagem para lembrar que você tem uma consulta agendada para {{scheduledFor}}.</p>
      <p>Por favor, certifique-se de estar disponível no horário marcado.</p>
      <p>Se precisar reagendar ou cancelar, entre em contato conosco o quanto antes.</p>
      <p>Atenciosamente,<br>Equipe Sanara</p>
    `
  },
  {
    name: 'appointment-confirmation',
    description: 'Template for appointment confirmation notifications',
    type: 'EMAIL',
    subject: 'Confirmação de Agendamento - Sanara',
    content: `
      <h2>Confirmação de Agendamento</h2>
      <p>Olá,</p>
      <p>Seu agendamento foi confirmado com sucesso para {{scheduledFor}}.</p>
      <p>Detalhes do agendamento:</p>
      <ul>
        <li>Data e Hora: {{scheduledFor}}</li>
        <li>ID do Agendamento: {{appointmentId}}</li>
      </ul>
      <p>Atenciosamente,<br>Equipe Sanara</p>
    `
  },
  {
    name: 'appointment-cancellation',
    description: 'Template for appointment cancellation notifications',
    type: 'EMAIL',
    subject: 'Cancelamento de Consulta - Sanara',
    content: `
      <h2>Cancelamento de Consulta</h2>
      <p>Olá,</p>
      <p>Sua consulta agendada para {{scheduledFor}} foi cancelada.</p>
      <p>Se desejar reagendar, por favor entre em contato conosco.</p>
      <p>Atenciosamente,<br>Equipe Sanara</p>
    `
  },
  {
    name: 'consultation-started',
    description: 'Template for consultation start notifications',
    type: 'EMAIL',
    subject: 'Sua Consulta Começou - Sanara',
    content: `
      <h2>Sua Consulta Começou</h2>
      <p>Olá,</p>
      <p>Sua consulta está pronta para começar.</p>
      <p>Por favor, acesse a plataforma para iniciar sua consulta.</p>
      <p>ID da Consulta: {{consultationId}}</p>
      <p>Atenciosamente,<br>Equipe Sanara</p>
    `
  },
  {
    name: 'consultation-ended',
    description: 'Template for consultation end notifications',
    type: 'EMAIL',
    subject: 'Consulta Finalizada - Sanara',
    content: `
      <h2>Consulta Finalizada</h2>
      <p>Olá,</p>
      <p>Sua consulta foi finalizada com sucesso.</p>
      <p>Em breve você receberá um relatório detalhado da consulta.</p>
      <p>ID da Consulta: {{consultationId}}</p>
      <p>Atenciosamente,<br>Equipe Sanara</p>
    `
  },
  {
    name: 'consultation-report',
    description: 'Template for consultation report notifications',
    type: 'EMAIL',
    subject: 'Relatório da Consulta Disponível - Sanara',
    content: `
      <h2>Relatório da Consulta</h2>
      <p>Olá,</p>
      <p>O relatório da sua consulta já está disponível.</p>
      <p>Você pode acessá-lo através do link abaixo:</p>
      <p><a href="{{reportUrl}}">Acessar Relatório</a></p>
      <p>ID da Consulta: {{consultationId}}</p>
      <p>Atenciosamente,<br>Equipe Sanara</p>
    `
  },
  {
    name: 'appointment-reminder-sms',
    description: 'Template for appointment reminder SMS',
    type: 'SMS',
    content: 'Sanara: Lembrete de consulta para {{scheduledFor}}. Se precisar reagendar, entre em contato.'
  },
  {
    name: 'appointment-confirmation-sms',
    description: 'Template for appointment confirmation SMS',
    type: 'SMS',
    content: 'Sanara: Agendamento confirmado para {{scheduledFor}}. ID: {{appointmentId}}'
  },
  {
    name: 'appointment-cancellation-sms',
    description: 'Template for appointment cancellation SMS',
    type: 'SMS',
    content: 'Sanara: Consulta de {{scheduledFor}} foi cancelada. Para reagendar, entre em contato.'
  },
  {
    name: 'consultation-started-push',
    description: 'Template for consultation start push notifications',
    type: 'PUSH',
    subject: 'Sua Consulta Começou',
    content: 'Sua consulta está pronta para começar. Acesse a plataforma para iniciar.'
  },
  {
    name: 'consultation-ended-push',
    description: 'Template for consultation end push notifications',
    type: 'PUSH',
    subject: 'Consulta Finalizada',
    content: 'Sua consulta foi finalizada. Em breve você receberá o relatório.'
  },
  {
    name: 'consultation-report-push',
    description: 'Template for consultation report push notifications',
    type: 'PUSH',
    subject: 'Relatório Disponível',
    content: 'O relatório da sua consulta já está disponível para visualização.'
  }
]; 