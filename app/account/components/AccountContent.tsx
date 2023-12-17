"use client"

import {AiOutlinePlus} from "react-icons/ai";
import DeleteButton from "@/components/DeleteButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song, UserDetails } from "@/types";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useUpdateModal from "@/hooks/useUpdateModal";

interface AccountContentProps {
	songs: Song[];
}

const AccountContent: React.FC<AccountContentProps> = ({
	songs
}) => {

	const AuthModal = useAuthModal();
	const UpdateModal = useUpdateModal();
	const {user} = useUser();

  const onPlay = useOnPlay(songs);

	const onClick = () => {
		if (!user) {
			return AuthModal.onOpen();
		}

		return UpdateModal.onOpen();
	}	

  if (songs.length === 0) {
    return (
      <div 
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full px-6 
          text-neutral-400
        "
      >
        No songs available.
      </div>
    )
  }
	return (
		<div className="flex flex-col gap-y-2 w-full p-6">
			{songs.map((item) => (
				<div className="flex items-center gap-x-4 w-full">
					<div className="flex-1">
						<MediaItem
						onClick={(id: string) => onPlay(id)}
						key={item.id} 
						data={item}
					/>
					</div>
          <DeleteButton songId={item.id}/>
				</div>
			))}
		</div>
	)
}
export default AccountContent