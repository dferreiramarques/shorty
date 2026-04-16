export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <title>monco.io - URL Shortener</title>
        <meta name="description" content="URL Shortener pessoal" />
      </head>
      <body>{children}</body>
    </html>
  );
}