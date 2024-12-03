// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona para a página de cadastro assim que a aplicação for carregada
  redirect('/cadastro');
}
