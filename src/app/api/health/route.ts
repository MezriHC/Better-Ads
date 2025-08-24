export async function GET() {
  try {
    return new Response('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  } catch {
    return new Response('ERROR', { 
      status: 500 
    })
  }
}