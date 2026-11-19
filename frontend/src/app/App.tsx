import { Route, Routes } from 'react-router-dom';
import { CreatePetPage } from '../pages/create-pet';
import { FlyerPage } from '../pages/flyer';
import { HomePage } from '../pages/home';
import { NotFoundPage } from '../pages/not-found';
import { PetDetailsPage } from '../pages/pet-details';
import Layout from './layouts/Layout';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="pets/new" element={<CreatePetPage />} />
                <Route path="pets/:id" element={<PetDetailsPage />} />
                <Route path="pets/:id/flyer" element={<FlyerPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
