import { NextResponse } from "next/server"

export async function GET() {
  const embedScript = `
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = '${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app"}/widget';
  iframe.style.width = '100%';
  iframe.style.height = '800px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
  
  var container = document.getElementById('zero-caries-widget');
  if (container) {
    container.appendChild(iframe);
  }
})();
`

  return new NextResponse(embedScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
