import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Ads } from "./pages/Ads/Ads.tsx"
import { AdDetails } from "./pages/AdDetails/AdDetails.tsx"
import { AdEdit } from "./pages/AdEdit/AdEdit.tsx"
import { useTheme } from "./hooks/useTheme.ts";

export function App() {
	const { theme, toggleTheme } = useTheme()

	return (
		<div className="wrapper">
			<button onClick={toggleTheme}>
				Сменить тему на {theme === 'dark' ? 'светлую' : 'темную'}
			</button>
			<Router>
				<Routes>
					<Route path="/" element={<Navigate to="/ads" replace />} />
					<Route path="/ads" element={<Ads />} />
					<Route path="/ads/:id" element={<AdDetails />} />
					<Route path="/ads/:id/edit" element={<AdEdit />} />
					{/* fallback */}
					<Route path="*" element={<Navigate to="/ads" replace />} />
				</Routes>
			</Router>
		</div>
	)
}