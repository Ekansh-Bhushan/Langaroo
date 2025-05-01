import { Loader } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <Loader className="animate-spin h-6 w-6 text-muted-foreground"/>
        </div>
    )
}
export default Loading;