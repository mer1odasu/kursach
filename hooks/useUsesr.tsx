import { User } from "@supabase/auth-helpers-nextjs";
import {useSessionContext, useUser as useSuperUser} from "@supabase/auth-helpers-react";
import {createContext, useState} from "react";

import {Subscription, UserDetails} from "@/types";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
)

export interface Props {
    [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSuperUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsloadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)

    const getUserDetails = () => supabase.from('user').select('*').single();
    const getSubscription = () =>
        supabase
            .from('subscription')
            .select('*, prices(*, products(*))')

}