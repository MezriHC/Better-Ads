"use client"

export default function StorageTab() {
  return (
    <div className="h-full bg-background">
      <iframe
        src="https://minio.trybetterads.com"
        className="w-full h-full border-0"
        title="Console MinIO"
        style={{ 
          background: 'white',
          colorScheme: 'light'
        }}
      />
    </div>
  )
}
