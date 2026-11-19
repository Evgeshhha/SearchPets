import { Card, CardContent, Skeleton } from '@mui/material';

export default function PetCardSkeleton() {
    return (
        <Card sx={{ height: '100%' }} aria-hidden>
            <Skeleton variant="rectangular" height={180} />
            <CardContent>
                <Skeleton width="60%" height={32} />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
            </CardContent>
        </Card>
    );
}
