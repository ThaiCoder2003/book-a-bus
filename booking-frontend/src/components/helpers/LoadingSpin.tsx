import { Loader2 } from 'lucide-react'

const LoadingSpin = ({ content }: { content: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 w-full h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground mt-2 text-sm">{content}</p>
        </div>
    )
}

export default LoadingSpin
