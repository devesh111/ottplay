import { cn } from "@/lib/utils";

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            data-slot="skeleton"
            className={cn("bg-[#292038] animate-pulse rounded-md", className)}
            {...props}
        />
    );
};

export default Skeleton;
