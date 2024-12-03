import './globals.css';

export const metadata = {
  title: "Techpark",
  description: "Gerenciamento de Estacionamento com Techpark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Define a meta descrição e qualquer outro dado global no head */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
