import { Button } from '@mui/material';
import StateMessage from './StateMessage';

interface Props {
    message: string;
    onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
    return (
        <StateMessage
            role="alert"
            title="Что-то пошло не так"
            description={message}
            action={
                <Button
                    variant="outlined"
                    onClick={onRetry}>
                    Повторить
                </Button>
            }
        />
    );
}
