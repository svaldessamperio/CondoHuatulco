import { useState } from 'react';

export const useForm = <T extends Object>( initState: T ) => {
    
    const [state, setState] = useState( initState );
    const [error, setError] = useState({});
    const [isError, setIsError] = useState(true);

    const onChange = ( value: string, field: keyof T, regexp:RegExp, errorMessage:string ) => {

        if(regexp) {
            
            if (!regexp.test(value)) {
                setIsError(true);
                setError({
                    ...error,
                    [field]: errorMessage,
                });
            } else {
                setIsError(false);
                setError({
                    ...error,
                    [field]: '',
                });
            }
        }

        setState({
            ...state,
            [field]: value
        });
        
    }

    return {
        ...state,
        form: state,
        error,
        isError,
        onChange,
    }

}