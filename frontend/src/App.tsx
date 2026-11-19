import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { PetDetailsPage } from './pages/pet-details'
import { HomePage } from './pages/home'
import { NotFoundPage } from './pages/not-found'
import CreatePetPage from './pages/CreatePetPage'
import FlyerPage from './pages/FlyerPage'

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="pets/:id" element={<PetDetailsPage />} />
                <Route path="pets/:id/flyer" element={<FlyerPage />} />
                <Route path="pets/new" element={<CreatePetPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}