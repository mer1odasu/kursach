"use client"

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import UpdateModal from "@/components/UpdateModal";

const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if(!isMounted) {
		return null; 
	}

	return (
		<>
		<AuthModal />
		<UploadModal />
		<UpdateModal/>
		</>
	);
}

export default ModalProvider