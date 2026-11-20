import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../features/auth';
import { CreatePetPage } from '../pages/create-pet';
import { FlyerPage } from '../pages/flyer';
import { HomePage } from '../pages/home';
import { LoginPage } from '../pages/login';
import { NotFoundPage } from '../pages/not-found';
import { PetDetailsPage } from '../pages/pet-details';
import { RegisterPage } from '../pages/register';
import { EditPetPage } from '../pages/edit-pet';
import Layout from './layouts/Layout';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route element={<RequireAuth />}>
                    <Route path="pets/new" element={<CreatePetPage />} />
                    <Route path="pets/:id/edit" element={<EditPetPage />} />
                </Route>
                <Route path="pets/:id" element={<PetDetailsPage />} />
                <Route path="pets/:id/flyer" element={<FlyerPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}