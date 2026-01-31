import { useState, useEffect } from 'react';
import './Game.css';

const Confetti = () => {
    const pieces = 400; 

    return (
        <div className="confetti-container">
            {Array.from({ length: pieces }).map((_, i) => {
                const left = Math.random() * 100;
                const duration = Math.random() * 15 + 10;
                const delay = Math.random() * 5;
                const size = Math.random() * 25 + 10;

                const isHeart = Math.random() > 0.6;
                const heartEmoji = ['❤️', '💖', '💗', '💓', '💞', '💕'][Math.floor(Math.random() * 6)];
            
                const colors = ['#ff6b8b', '#ff9e9e', '#ffd166', '#c9a959', '#ff8e8e', '#ffb4b4'];
                const color = colors[Math.floor(Math.random() * colors.length)];

                return (
                    <div
                        key={i}
                        className={`confetti-piece ${isHeart ? 'heart' : 'shape'}`}
                        style={{
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                            color: isHeart ? color : 'transparent',
                            backgroundColor: isHeart ? 'transparent' : color,
                            fontSize: `${size}px`,
                            lineHeight: `${size}px`,
                            borderRadius: isHeart ? '0' : (Math.random() > 0.5 ? '50%' : '0'),
                        }}
                    >
                        {isHeart ? heartEmoji : ''}
                    </div>
                );
            })}
        </div>
    );
};

const Game = () => {
    const RESPUESTA_CORRECTA_NOMBRE = "mi amor";
    const RESPUESTA_CORRECTA_CLAVE = "20-JJ-10122024";

    const [nombre, setNombre] = useState("");
    const [clave, setClave] = useState("");
    const [pistaVisible, setPistaVisible] = useState(0);
    const [intentos, setIntentos] = useState(0);
    
    const [partesAdivinadas, setPartesAdivinadas] = useState({
        primera: false,
        segunda: false,
        tercera: false
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitulo, setModalTitulo] = useState("");
    const [modalMensaje, setModalMensaje] = useState("");
    const [modalTipo, setModalTipo] = useState("");

    const pistas = [
        "La primera parte tiene que ver con una fecha importante (sólo día)",
        "La segunda parte tiene que ver con nuestras inciales iguales",
        "La última parte tiene que ver con una fecha donde empezaste todo",
        "Cada parte esta separada por un guión",
    ];
    
    useEffect(() => {
        if (modalVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalVisible]);

    const mostrarModal = (titulo, mensaje, tipo) => {
        setModalTitulo(titulo);
        setModalMensaje(mensaje);
        setModalTipo(tipo);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
    };

    const verificarPartesClave = (claveIngresada) => {
        const claveUpper = claveIngresada.toUpperCase();
        let nuevasPartes = { ...partesAdivinadas };
        let mostrarModalParcial = false;
        let mensajeParcial = "";
        let tituloParcial = "";
        
        if (claveUpper.includes("20") && !partesAdivinadas.primera) {
            nuevasPartes.primera = true;
            mostrarModalParcial = true;
            tituloParcial = "¡Muy bien! 🎯";
            mensajeParcial = "¡Has adivinado la primera parte de la clave!\n\n✅ Tienes correcto: '20'\n\nAhora falta el resto...\n\nPista: Las siguientes partes son nuestras iniciales y una fecha especial.";
        }
        
        if ((claveUpper.includes("JJ") || claveUpper.includes("-JJ") || claveUpper.includes("JJ-")) && !partesAdivinadas.segunda) {
            nuevasPartes.segunda = true;
            mostrarModalParcial = true;
            tituloParcial = "¡Excelente! ✨";
            mensajeParcial = "¡Has adivinado las iniciales!\n\n✅ Tienes correcto: 'JJ'\n\n¡Perfecto! Ya tienes nuestras iniciales iguales.\n\nAhora solo falta la última parte...";
        }
        
        if ((claveUpper.includes("10122023") || claveUpper.includes("10/12/2023") || claveUpper.includes("10-12-2023")) && !partesAdivinadas.tercera) {
            nuevasPartes.tercera = true;
            mostrarModalParcial = true;
            tituloParcial = "¡Increíble! 💖";
            mensajeParcial = "¡Has adivinado la fecha especial!\n\n✅ Tienes correcto: '10122023'\n\n¡Qué memoria! Esa fecha es muy importante para mí.\n\nAhora solo falta juntar todas las partes correctamente...";
        }
        
        if (JSON.stringify(nuevasPartes) !== JSON.stringify(partesAdivinadas)) {
            setPartesAdivinadas(nuevasPartes);
            
            if (mostrarModalParcial) {
                setTimeout(() => {
                    mostrarModal(tituloParcial, mensajeParcial, "exito_parcial");
                }, 300);
            }
        }
        
        return nuevasPartes;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIntentos(intentos + 1);

        const nombreLimpio = nombre.toLowerCase().trim();
        const claveLimpia = clave.trim();

        const partesActualizadas = verificarPartesClave(claveLimpia);

        if (nombreLimpio === RESPUESTA_CORRECTA_NOMBRE && claveLimpia === RESPUESTA_CORRECTA_CLAVE) {            
            mostrarModal(
                "¡Felicidades! 🎉",
                `¡Lo lograste!\n\nHas descubierto el nombre y la clave secreta.\nCaptura esta pantalla y mandasela a tu novio`,
                "exito"
            );

            setTimeout(() => {
                setNombre("");
                setClave("");
                setPistaVisible(0);
                setIntentos(0);
                setPartesAdivinadas({ primera: false, segunda: false, tercera: false });
            }, 3000);
        } else {
            let titulo = "Respuesta incorrecta";
            let mensaje = "";

            if (nombreLimpio !== RESPUESTA_CORRECTA_NOMBRE && claveLimpia !== RESPUESTA_CORRECTA_CLAVE) {
                mensaje = "Tanto el nombre como la clave son incorrectos.";
            } else if (nombreLimpio !== RESPUESTA_CORRECTA_NOMBRE) {
                mensaje = "El nombre es incorrecto. Pero vas por buen camino...";
            } else {
                mensaje = "La clave es incorrecta. ¡Ya tienes el nombre!";
                
                const partesAdivinadasCount = Object.values(partesActualizadas).filter(Boolean).length;
                if (partesAdivinadasCount > 0) {
                    mensaje += `\n\n📊 Progreso: ${partesAdivinadasCount}/3 partes de la clave adivinadas`;
                    
                    if (partesActualizadas.primera) mensaje += "\n✅ Tienes la primera parte (20)";
                    if (partesActualizadas.segunda) mensaje += "\n✅ Tienes las iniciales (JJ)";
                    if (partesActualizadas.tercera) mensaje += "\n✅ Tienes la fecha (10122023)";
                    
                    mensaje += "\n\n💡 Recuerda: Las partes deben ir separadas por guiones: XX-XX-XXXXXXXX";
                }
            }

            if (intentos >= 2) {
                mensaje += "\n\n💡 Sugerencia: Usa el botón 'Revelar pista' para obtener ayuda.";
            }

            mostrarModal(titulo, mensaje, "error");
        }
    };

    const revelarPista = () => {
        if (pistaVisible < pistas.length) {
            setPistaVisible(pistaVisible + 1);
        }
    };

    const reiniciarJuego = () => {
        setNombre("");
        setClave("");
        setPistaVisible(0);
        setIntentos(0);
        setPartesAdivinadas({ primera: false, segunda: false, tercera: false });
    };

    return (
        <div className="game-container">
            {/* Ventana Modal a Pantalla Completa */}
            {modalVisible && (
                <div className="modal-overlay">
                    {/* Mostrar confetti solo para éxito completo */}
                    {modalTipo === "exito" && <Confetti />}
                    <div className={`modal-content ${modalTipo}`}>
                        <div className="modal-header">
                            <h2 className="modal-title">{modalTitulo}</h2>
                            {modalTipo === "exito" && (
                                <div className="modal-icon">🏆</div>
                            )}
                            {modalTipo === "exito_parcial" && (
                                <div className="modal-icon">⭐</div>
                            )}
                            {modalTipo === "error" && (
                                <div className="modal-icon">⚠️</div>
                            )}
                        </div>

                        <div className="modal-body">
                            {modalMensaje.split('\n').map((linea, index) => (
                                <p key={index} className="modal-line">{linea}</p>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={cerrarModal}
                                className={`modal-button ${modalTipo}-button`}
                                autoFocus
                            >
                                {modalTipo === "exito" ? "¡Continuar!" : 
                                    modalTipo === "exito_parcial" ? "¡Entendido!" : 
                                    "Intentar de nuevo"}
                            </button>

                            {modalTipo === "error" && (
                                <button
                                    onClick={() => {
                                        cerrarModal();
                                        revelarPista();
                                    }}
                                    className="modal-button pista-button-modal"
                                    disabled={pistaVisible >= pistas.length}
                                >
                                    Ver una pista
                                </button>
                            )}
                        </div>

                        <button className="modal-close" onClick={cerrarModal}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="game-header">
                <h1>💕 Araceli 💕 ¿Cómo estás? a parte de guapa 💗</h1>
                <p className="game-subtitle">Descubre el nombre especial y la clave secreta</p>
            </div>

            <div className="game-card">
                <form onSubmit={handleSubmit} className="game-form">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">
                            ¿Cómo crees que me gustaría llamarte?
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="form-input"
                            placeholder="Escribe tu respuesta aquí..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="clave" className="form-label">
                            Ingresa la clave secreta
                        </label>
                        <input
                            type="text"
                            id="clave"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            className="form-input"
                            placeholder="Formato: XX-XX-XXXXXXXX"
                            required
                        />
                    </div>
                    
                    {/* Progreso de la clave */}
                    <div className="progreso-clave">
                        <h4>Progreso de la clave secreta:</h4>
                        <div className="progreso-barras">
                            <div className={`progreso-item ${partesAdivinadas.primera ? 'completado' : ''}`}>
                                <span className="progreso-numero">1</span>
                                <span className="progreso-texto">Primera parte</span>
                                {partesAdivinadas.primera && <span className="progreso-check">✓</span>}
                            </div>
                            <div className={`progreso-item ${partesAdivinadas.segunda ? 'completado' : ''}`}>
                                <span className="progreso-numero">2</span>
                                <span className="progreso-texto">Iniciales</span>
                                {partesAdivinadas.segunda && <span className="progreso-check">✓</span>}
                            </div>
                            <div className={`progreso-item ${partesAdivinadas.tercera ? 'completado' : ''}`}>
                                <span className="progreso-numero">3</span>
                                <span className="progreso-texto">Fecha especial</span>
                                {partesAdivinadas.tercera && <span className="progreso-check">✓</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button
                            type="button"
                            className="reset-button"
                            onClick={reiniciarJuego}
                        >
                            Reiniciar Juego
                        </button>
                        <button type="submit" className="submit-button">
                            Verificar Respuestas
                        </button>
                    </div>

                    {/* Sección de pistas */}
                    <div className="pistas-section">
                        <div className="pistas-header">
                            <h3>Pistas ({pistaVisible}/{pistas.length})</h3>
                            <button
                                type="button"
                                className="pista-button"
                                onClick={revelarPista}
                                disabled={pistaVisible >= pistas.length}
                            >
                                {pistaVisible === 0 ? "Revelar primera pista" :
                                    pistaVisible < pistas.length ? "Revelar siguiente pista" :
                                        "Todas las pistas reveladas"}
                            </button>
                        </div>

                        <div className="pistas-container">
                            {pistaVisible > 0 ? (
                                <ul className="pistas-list">
                                    {pistas.slice(0, pistaVisible).map((pista, index) => (
                                        <li key={index} className="pista-item">
                                            <span className="pista-numero">Pista {index + 1}:</span> {pista}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="pista-placeholder">
                                    Presiona el botón para revelar pistas sobre la clave secreta
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="game-stats">
                        <p>Intentos realizados: <span className="intentos-count">{intentos}</span></p>
                        <p>Partes adivinadas: <span className="partes-count">
                            {Object.values(partesAdivinadas).filter(Boolean).length}/3
                        </span></p>
                        <p className="game-tip">
                            💡 Consejo: La clave tiene 3 partes separadas por guiones
                        </p>
                    </div>
                </form>

                {/* Instrucciones del juego */}
                <div className="instructions">
                    <h3>Instrucciones</h3>
                    <ul>
                        <li>Intenta adivinar cómo me gustaria llamarte (dos palabras)</li>
                        <li>Descubre la clave secreta con la ayuda de las pistas</li>
                        <li>¡Recibirás felicitaciones cuando adivines cada parte de la clave!</li>
                        <li>Primero adivina la clave!</li>
                        <li>Completa los 3 campos de la clave y luego pon el nombre para verificar la respuesta!!</li>
                        <li>¡Diviértete!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Game;
