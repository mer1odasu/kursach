"use client"

import useUpdateModal from "@/hooks/useUpdateModal"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import { useState } from "react";
import Button from "./Button";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";


const UpdateModal = () => {

	const [isLoading, setIsLoading] = useState(false);

	const updateModal = useUpdateModal();

	const supabaseClient = useSupabaseClient();

	const router = useRouter();

	const {user} = useUser();


	const {
		register,
		handleSubmit,
		reset
	} = useForm<FieldValues>({
		defaultValues: {
			author: '',
			titlel: '',
			song: null,
			image: null,
		}
	})

	const onChange = (open: boolean) => {
		if (!open) {
			reset()
			updateModal.onClose();
		}
	}

	const onSubmit: SubmitHandler<FieldValues> = async (values) => {
		try {
			setIsLoading(true);
	
			const imageFile = values.image?.[0];
			const songFile = values.song?.[0];
	
			const uniqueID = uniqid();
	
			// Upload song
			const { data: songData, error: songError } = await supabaseClient
				.storage
				.from('songs')
				.upload(`song-${values.title}-${uniqueID}`, songFile, {
					cacheControl: '3600',
					upsert: false
				});
	
			if (songError) {
				setIsLoading(false);
				return toast.error('Failed song upload.');
			}
	
			if (!imageFile || !songFile || !user) {
				setIsLoading(false);
				toast.error('Missing fields');
				return;
			}
	
			// Upload image
			const { data: imageData, error: imageError } = await supabaseClient
				.storage
				.from('images')
				.upload(`image-${values.title}-${uniqueID}`, imageFile, {
					cacheControl: '3600',
					upsert: false
				});
	
			if (imageError) {
				setIsLoading(false);
				return toast.error('Failed image upload');
			}
	
			const { error: supabaseError } = await supabaseClient
			.from('users')
			.insert({
				full_name: values.full_name,
				image_path: imageData.path,
			});
	
			if (supabaseError) {
				setIsLoading(false);
				return toast.error(supabaseError.message);
			}
	
			router.refresh();
			setIsLoading(false);
			toast.success('Song created!');
			reset();
			updateModal.onClose();
	
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Modal
		title="Edit a song"
		description="Update an mp3 file"
		isOpen={updateModal.isOpen}
		onChange={onChange}
		
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-y-4"
			>
				<Input 
					id="title"
					disabled={isLoading}
					{...register('title')}
					placeholder="Song title"
				/>
				<Input 
				id="author"
				disabled={isLoading}
				{...register('author')}
				placeholder="Song author"
				/>
				<div>
					<div className="pb-1">
						Select a song fiel
					</div>
					<Input 
						id="song"
						type="file"
						disabled={isLoading}
						accept=".mp3"
						{...register('song')}
					/>
				</div>
				<div>
					<div className="pb-1">
						Select an image
					</div>
					<Input 
						id="image"
						type="file"
						disabled={isLoading}
						accept="image/*"
						{...register('image')}
					/>
				</div>
				<Button className="bg-neutral-100" disabled={isLoading} type="submit"> 
					Update
				</Button>
			</form>
		</Modal>
	)
}

export default UpdateModal;