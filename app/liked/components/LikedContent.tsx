"use client"

import { Song } from "@/types";

import { useRouter } from "next/navigation";

interface LikedContentProps {
	songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({
	songs
}) => {
	const router = useRouter();
	return (
		<div>
			Liked Content!
		</div>
	)
}

export default LikedContent;