/**
 * @typedef Props - Props para el boton.
 * @property {React.ReactNode} children - Contenido interno del boton.
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClick - Manejador de click.
 * @property {string} [className] - Clases CSS para el boton.
 */

/**
 * Boton reutilizable que acepta contenido interno, un manejador de click y clases CSS opcionales.
 * @param {Props} param0 
 * @returns {React.ReactElement} - Un elemento de boton con el contenido y comportamiento especificados.
 */
export default function Button({ children, onClick, className }) {
    return (
        <button
            onClick={onClick}
            className={`${className?.trim() || ''}`}
        >
            {children}
        </button>
    );
}
//naaaa matias te pasaste loco 🥵🥵🥵🥵🥵
//si necesitas más ideas para alentar a tus compañeros, ¡hazmelo saber! Estoy aquí para ayudarte a motivar a tu equipo. ¡Vamos, que juntos pueden lograr grandes cosas! 🚀🔥