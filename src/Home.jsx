import React, { useState } from 'react';
import { db, storage } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Home = () => {
  const [servicio, setServicio] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [pagos, setPagos] = useState([]);

  const handleAddPago = async () => {
    try {
      let comprobanteURL = '';
      if (comprobante) {
        const storageRef = ref(storage, `comprobantes/${comprobante.name}`);
        await uploadBytes(storageRef, comprobante);
        comprobanteURL = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, 'pagos'), {
        servicio,
        monto,
        fechaPago,
        comprobanteURL,
      });

      const newPago = {
        id: docRef.id,
        servicio,
        monto,
        fechaPago,
        comprobanteURL,
      };
      setPagos([...pagos, newPago]);

      setServicio('');
      setMonto('');
      setFechaPago('');
      setComprobante(null);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const fetchPagos = async () => {
    const querySnapshot = await getDocs(collection(db, 'pagos'));
    const pagosData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPagos(pagosData);
  };

  useState(() => {
    fetchPagos();
  }, []);

  return (
    <div>
      <section>
        <form>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
          >
            <option value="">Seleccionar Servicio</option>
            <option value="AySA">AySA</option>
            <option value="Metrogas">Metrogas</option>
            <option value="Edesur">Edesur</option>
            <option value="Municipal">Municipal</option>
            <option value="ARBA">ARBA</option>
            <option value="Telecentro">Telecentro</option>
            <option value="Movistar">Movistar</option>
            <option value="Tarjeta Visa">Tarjeta Visa</option>
            <option value="Seguro">Seguro</option>
          </select>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Monto"
          />
          <input
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setComprobante(e.target.files[0])}
          />
          <button type="button" onClick={handleAddPago}>
            Agregar
          </button>
          <button
            type="button"
            onClick={() => {
              setServicio('');
              setMonto('');
              setFechaPago('');
              setComprobante(null);
            }}
          >
            Cancelar
          </button>
        </form>
      </section>
      <section>
        <table>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Monto</th>
              <th>Fecha de Pago</th>
              <th>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.servicio}</td>
                <td>{pago.monto}</td>
                <td>{pago.fechaPago}</td>
                <td>
                  {pago.comprobanteURL && (
                    <a
                      href={pago.comprobanteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Comprobante
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Home;
