import { getDynamicContent } from '@/src/lib/domain/repositories'

const faqItems = [
  {
    question: 'O que é o True Crime Club?',
    answer:
      'Um clube de assinatura que envia mensalmente uma box temática de true crime com curadoria exclusiva e conteúdo gamificado.',
  },
  {
    question: 'O que vem na box?',
    answer:
      'Uma seleção surpresa entre itens colecionáveis, papelaria, decoração, moda e conteúdo exclusivo — sem prometer todos os tipos em uma única edição.',
  },
  {
    question: 'Qual a diferença entre cobrança e envio?',
    answer:
      'A cobrança ocorre no mês da compra. O envio acontece no mês seguinte (ex.: compra em março, despacho em abril).',
  },
  {
    question: 'Posso cancelar a assinatura?',
    answer:
      'No plano mensal, sim, a qualquer momento. O plano anual possui permanência de 12 meses.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Cartão de crédito e Pix (mockados nesta versão de validação).',
  },
]

export default function FaqPage() {
  const intro = getDynamicContent('faq.intro')

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">
        Perguntas frequentes
      </h1>
      <p className="mt-2 text-muted-foreground">
        {intro?.value ?? 'Respostas para as dúvidas mais comuns sobre o clube.'}
      </p>

      <div className="mt-10 space-y-4">
        {faqItems.map((item) => (
          <details
            key={item.question}
            className="rounded-xl border border-border bg-card p-4"
          >
            <summary className="cursor-pointer font-medium">
              {item.question}
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
