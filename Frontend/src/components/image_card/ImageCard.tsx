import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ImageCardProps {
  url: string
  prompt: string
}

export default function ImageCard({ url, prompt }: ImageCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-0">
        <img src={url} alt={prompt} className="w-full h-64 object-cover rounded-t-lg" />
      </CardContent>
      <CardFooter className="p-2 text-xs text-zinc-400">{prompt}</CardFooter>
    </Card>
  )
}
