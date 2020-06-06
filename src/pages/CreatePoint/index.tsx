import React, { useEffect, useState, ChangeEvent } from 'react'
import './CreatePoint.css'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'

interface Item {
  id: number,
  name: string,
  image_url: string
}

interface UF {
  sigla: string
}

interface CityResponse {
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [selectedUf, setSelectedUf] = useState('0')

  useEffect(() => {
    api.get('items')
      .then(res => {
        setItems(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(res => {
        const ufInitials = res.data.map(uf => uf.sigla)
        setUfs(ufInitials)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }
    axios.get<CityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityNames = res.data.map(city => city.nome)
        setCities(cityNames)
      })
      .catch(err => console.log(err))
  }, [selectedUf])

  function handleSelect(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    setSelectedUf(uf)
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Imagem de logo do ecoleta"/>

        <Link to="/" >
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form >
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name"/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-22.6592277, -43.1487236]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-22.6592277, -43.1487236]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" onChange={handleSelect}  value={selectedUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => {
                  return (
                    <option key={uf} value={uf}>{uf}</option>
                  )
                })}
                
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma Cidade</option>
                {cities.map(city => {
                  return (
                    <option key={city} value={city}>{city}</option>
                  )
                })}
              </select>
            </div>

          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => {
              return (
                <li key={item.id}>
                  <img src={item.image_url} alt={item.name} />
                  <span>{item.name}</span>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint