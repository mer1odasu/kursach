"use client"

import { MdDelete } from "react-icons/md";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
	songId: string;
}


const DeleteButton: React.FC<DeleteButtonProps> = ({
	songId
}) => {

	const Icon = MdDelete

	const { supabaseClient } = useSessionContext();


	const authModal = useAuthModal();
	const {user} = useUser();

	const [isDeleted, setIsDeleted] = useState(false);


	const fetchData = async () => {
		const { data, error } = await supabaseClient
			.from('songs')
			.select('*')
			.eq('id', songId)
			.single();
	
		if (!error && data) {
			setIsDeleted(false);
		}
	};
	fetchData();


	const handleDelete = async () => {
		console.log(songId);
		if (!isDeleted) {
			const { error } = await supabaseClient
				.from('songs')
				.delete()
				.eq('id', songId);
		
			if (error) {
				toast.error(error.message);
			} else {
				setIsDeleted(true);
				toast.success('Deleted!');
			}
		}
	}


	return (
		<button
			onClick={handleDelete}
			className="
			hover:opacity-75
			transition
			"
			>
			<Icon color={'white'} size={25} />
		</button>
	)
}

export default DeleteButton;