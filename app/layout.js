export const metadata = {
  title: 'Instagram Post Helper',
  description: 'Daily sprint project for 11-20'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

