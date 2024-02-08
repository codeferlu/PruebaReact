import React, { useState, useEffect } from 'react';

export const API = () => {
    const [memoria, setMemoria] = useState([]);
    const [llenarDeNuevo, setllenarDeNuevo] = useState(false);
    const [miembroAleatorio, setMiembroAleatorio] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            copiandoPlaylist();
        }, 8000);
    }, [llenarDeNuevo]);

    const copiandoPlaylist = async () => {
        try {
            const productsJson = await fetch('https://narutodb.xyz/api/akatsuki');
            if (!productsJson.ok) {
                throw new Error('Failed to fetch data');
            }
            const { akatsuki } = await productsJson.json();

            console.log('Datos recibidos de la API:', akatsuki);

            if (!Array.isArray(akatsuki)) {
                throw new Error('Data received is not an array');
            }

            const indicesFiltrados = [0, 3, 6, 9, 10, 11, 12, 16];
            const dataFiltered = indicesFiltrados.map((index) => {
                const element = akatsuki[index];
                if (!element) {
                    console.error(`No hay un elemento en el índice ${index}`);
                    return null;
                }
                const { id, name, images } = element;
                return {
                    id,
                    title: name,
                    image: images[0], // Tomar solo la primera imagen
                };
            }).filter(Boolean); // Filtrar elementos nulos si hay algún índice no válido

            setMemoria(dataFiltered);
            setllenarDeNuevo(false);

            console.log('Copiando playlist....😀');
        } catch (error) {
            console.error('Error fetching or processing data:', error);
        }
    };

    const handleOnClick = () => {
        setMemoria([]); // Borrar memoria
        setllenarDeNuevo(true); // Volver a guardar la playlist
        setMiembroAleatorio(null); // Limpiar el miembro aleatorio seleccionado
    };

    const handleShowRandomMember = () => {
        if (memoria.length === 0) {
            console.error('La lista de miembros filtrados está vacía');
            return;
        }
        const indiceAleatorio = Math.floor(Math.random() * memoria.length);
        const miembroSeleccionado = memoria[indiceAleatorio];
        console.log('Miembro aleatorio:', miembroSeleccionado);
        setMiembroAleatorio(miembroSeleccionado);
    };

    const handleOnSort = () => {
        const dataOrdered = memoria.sort((a, b) =>
            a?.title.localeCompare(b?.title)
        );

        console.log(dataOrdered, 'data Ordered');
    };

    return (
        <>
            <div>
                <h1>Akatsuki Clan</h1>
                <button onClick={handleOnClick}>Cargar otra PLAYLIST</button>
                <button onClick={handleOnSort}>Ordenar por título</button>
                <button onClick={handleShowRandomMember}>Mostrar Miembro Aleatorio</button>
                <hr />
                {memoria.length ? (
                    memoria.map((product, key) => (
                        <div key={key}>
                            <h3>{product.title}</h3>
                            <figure style={{ width: '200px' }}>
                                <img
                                    src={product.image}
                                    alt="image"
                                    style={{ width: '100%' }}
                                />
                            </figure>
                        </div>
                    ))
                ) : (
                    <h1>Cargando la lista de los miembros más peligrosos de Akatsuki....</h1>
                )}
                {miembroAleatorio && (
                    <div>
                        <h3>Miembro Aleatorio Seleccionado:</h3>
                        <h4>{miembroAleatorio.title}</h4>
                        <figure style={{ width: '200px' }}>
                            <img
                                src={miembroAleatorio.image}
                                alt="image"
                                style={{ width: '100%' }}
                            />
                        </figure>
                    </div>
                )}
            </div>
        </>
    );
};
