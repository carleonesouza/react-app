import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, TileLayer,Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';
import './style.css';
import Item from '../../model/Item';
import IBGEUFResponse from '../../model/IBGEUfResponse';
import IBGECityResponse from '../../model/IBGECityResponse';
import MyHearder from '../header';

// array ou objeto: informar manualmente o tipo de variavel 

const CreatePoint = () => {
const [items, setItems] = useState<Item[]>([]);
const [ufs, setUfs] = useState<string[]>([]);
const [cities, setCities] = useState<string[]>([]);
const [initialPosition, setInicitalPosition] = useState<[number, number]>([0,0])
const [selectedUf, setSelectedUf] = useState('0');
const [selectedCity, setSelectedCity] = useState('0');
const [selectedItems, setSelectedItems] = useState<number[]>([]);
const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
const [formData, setFormData] = useState({
    name:'',
    email:'',
    whatsapp: ''
});
const history = useHistory();
// Getting the current location of the device
useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;

        setInicitalPosition([latitude, longitude]);
    })
},[]);
// Getting the api response
useEffect(() => {
    api.get('items').then(response => {
        setItems(response.data);
    })
},[]);
//Getting datas from the IBGE API
useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
       const ufInitials = response.data.map(uf => uf.sigla);
       setUfs(ufInitials);
    });
},[]);

useEffect(() => {
    if (selectedUf === '0') {
        return;
    }
    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
       const cityNames = response.data.map( city => city.nome);
       setCities(cityNames);
    });
// Change the component acordly with the selection of the item property
},[selectedUf]);   

//Getting the values of the event throug the HTML properties 
function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const { name, value} = event.target;
// presevar todo o conteúdo do objeto ou array se já existir
// mudar o item de acordo com a propriedade passada
    setFormData({...formData, [name]: value});
}
//nunca alterar o estado de forma direta useState
function handleSelectItem(id: number){
    // verificar se o item selecionado já tinha sido selecionado.
    //o findIndex retorna um numero -zero ou maior que 1 
    // se o paramentro já existe no array
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected >= 0) {
        //pegar tudo menos aquele que o id é igual
        const filteredItems = selectedItems.filter(item => item !== id);
        setSelectedItems(filteredItems);
    }else{
        //presevar o que ja tem no array ou objeto adiciona ou altera o item passado
        setSelectedItems([...selectedItems, id ]);
    }
    
}
function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
   setSelectedUf(event.target.value);
}
function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
    setSelectedCity(event.target.value);
}
//Getting the clicked position on the LeafMAP
function handleMapClick (event: LeafletMouseEvent) {
 setSelectedPosition([
     event.latlng.lat,
     event.latlng.lng
 ])
}

async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [ latitude, longitude ] = selectedPosition;
    const items = selectedItems;

    const data = {
        name,
        email,
        whatsapp,
        uf,
        city,
        latitude,
        longitude,
        items
    };
    await api.post('points', data);
    history.push('/success');
}
    return (
        <div id="page-create-point">
            <MyHearder/>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                        type="text"
                         name="name"
                         id="name"
                         onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                            />
                        </div>
                        
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend> 

                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                <Marker position={selectedPosition}/>
                        </Map> 



                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf"> Estado (UF)</label>
                            <select 
                            name="uf"
                            id="uf" 
                            value={selectedUf}
                            onChange={handleSelectedUf}>
                            <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
 
                        <div className="field">
                            <label htmlFor="city"> Cidade</label>
                            <select 
                            name="city" 
                            id="city"
                            value={selectedCity}
                            onChange={handleSelectedCity}
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(town => (
                                    <option key={town} value={town}>{town}</option>
                                    ))
                                }
                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map((item: Item) => (
                            <li 
                            key={item.id}
                             onClick={() =>handleSelectItem(item.id)}
                             className={selectedItems.includes(item.id)? 'selected': ''}
                             >
                            <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                        </li>
                        ))}                                             
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;