'use client'

import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'
import type { Address } from '@/src/lib/domain/types'

export default function PerfilPage() {
  // State for Customer Info
  const [name, setName] = useState('Mariana Silva')
  const [phone, setPhone] = useState('(11) 98765-4321')
  const [email, setEmail] = useState('mariana.silva@email.com')
  const [cpf, setCpf] = useState('321.654.987-00')
  const [shirtSize, setShirtSize] = useState('M')
  const [shoeSize, setShoeSize] = useState('38')
  const [notes, setNotes] = useState(
    'Prefere tons escuros nas peças de vestuário.',
  )

  // Edit Modes
  const [editBasics, setEditBasics] = useState(false)
  const [editContact, setEditContact] = useState(false)
  const [editPrefs, setEditPrefs] = useState(false)

  // Temporary edit states
  const [tempName, setTempName] = useState('')
  const [tempCpf, setTempCpf] = useState('')
  const [tempEmail, setTempEmail] = useState('')
  const [tempPhone, setTempPhone] = useState('')
  const [tempShirt, setTempShirt] = useState('')
  const [tempShoe, setTempShoe] = useState('')
  const [tempNotes, setTempNotes] = useState('')

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddrLabel, setNewAddrLabel] = useState('')
  const [newAddrStreet, setNewAddrStreet] = useState('')
  const [newAddrNumber, setNewAddrNumber] = useState('')
  const [newAddrComplement, setNewAddrComplement] = useState('')
  const [newAddrNeighborhood, setNewAddrNeighborhood] = useState('')
  const [newAddrCity, setNewAddrCity] = useState('')
  const [newAddrState, setNewAddrState] = useState('')
  const [newAddrZip, setNewAddrZip] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.customer
      .getProfile()
      .then((data) => {
        if (data.customer) {
          setName(data.customer.name || '')
          setPhone(data.customer.phone || '')
          setEmail(data.customer.email || '')
          setShirtSize(data.customer.preferences?.shirtSize || 'M')
          setShoeSize(data.customer.preferences?.shoeSize || '38')
          setNotes(data.customer.preferences?.notes || '')

          setTempName(data.customer.name || '')
          setTempEmail(data.customer.email || '')
          setTempPhone(data.customer.phone || '')
          setTempShirt(data.customer.preferences?.shirtSize || 'M')
          setTempShoe(data.customer.preferences?.shoeSize || '38')
          setTempNotes(data.customer.preferences?.notes || '')
        }
        if (data.addresses) {
          setAddresses(data.addresses)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveBasics = async () => {
    try {
      await apiClient.customer.updateProfile({ name: tempName })
      setName(tempName)
      setCpf(tempCpf)
      setEditBasics(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSaveContact = async () => {
    try {
      await apiClient.customer.updateProfile({
        email: tempEmail,
        phone: tempPhone,
      })
      setEmail(tempEmail)
      setPhone(tempPhone)
      setEditContact(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSavePrefs = async () => {
    try {
      await apiClient.customer.updateProfile({
        preferences: {
          shirtSize: tempShirt,
          shoeSize: tempShoe,
          notes: tempNotes,
        },
      })
      setShirtSize(tempShirt)
      setShoeSize(tempShoe)
      setNotes(tempNotes)
      setEditPrefs(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      const updatedList = await apiClient.customer.deleteAddress(id)
      setAddresses(updatedList)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddrLabel || !newAddrStreet || !newAddrNumber || !newAddrZip) return

    try {
      const updatedList = await apiClient.customer.addAddress({
        label: newAddrLabel,
        street: newAddrStreet,
        number: newAddrNumber,
        complement: newAddrComplement,
        neighborhood: newAddrNeighborhood,
        city: newAddrCity,
        state: newAddrState,
        zipCode: newAddrZip,
      })

      setAddresses(updatedList)
      setShowAddAddress(false)

      // Reset fields
      setNewAddrLabel('')
      setNewAddrStreet('')
      setNewAddrNumber('')
      setNewAddrComplement('')
      setNewAddrNeighborhood('')
      setNewAddrCity('')
      setNewAddrState('')
      setNewAddrZip('')
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 animate-pulse items-center justify-center font-mono text-sm tracking-widest text-[#bfb4a3] uppercase">
        Carregando informações da conta...
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Minha conta
      </h1>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Gerencie suas informações cadastrais, de contato, preferências do clube
        e endereços de entrega das suas caixas.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Card 1: Informações Básicas */}
        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between border-b border-[#fffaf0]/10 pb-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0] uppercase">
              Informações Básicas
            </h3>
            {!editBasics ? (
              <button
                onClick={() => {
                  setTempName(name)
                  setTempCpf(cpf)
                  setEditBasics(true)
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#d7b56d] transition-colors hover:text-[#fffaf0]"
              >
                <IconEdit className="size-3.5" /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBasics}
                  className="cursor-pointer text-[#d7b56d] transition-colors hover:text-[#62d84e]"
                >
                  <IconCheck className="size-4" />
                </button>
                <button
                  onClick={() => setEditBasics(false)}
                  className="cursor-pointer text-[#ffb0a5] transition-colors hover:text-[#fffaf0]"
                >
                  <IconX className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                Nome Completo
              </p>
              {editBasics ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{name}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                CPF
              </p>
              {editBasics ? (
                <input
                  type="text"
                  value={tempCpf}
                  onChange={(e) => setTempCpf(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{cpf}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                Senha
              </p>
              <p className="mt-1 text-sm text-[#bfb4a3] italic">
                •••••••• (Edição restrita)
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Contato */}
        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between border-b border-[#fffaf0]/10 pb-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0] uppercase">
              Contato
            </h3>
            {!editContact ? (
              <button
                onClick={() => {
                  setTempEmail(email)
                  setTempPhone(phone)
                  setEditContact(true)
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#d7b56d] transition-colors hover:text-[#fffaf0]"
              >
                <IconEdit className="size-3.5" /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveContact}
                  className="cursor-pointer text-[#d7b56d] transition-colors hover:text-[#62d84e]"
                >
                  <IconCheck className="size-4" />
                </button>
                <button
                  onClick={() => setEditContact(false)}
                  className="cursor-pointer text-[#ffb0a5] transition-colors hover:text-[#fffaf0]"
                >
                  <IconX className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                E-mail
              </p>
              {editContact ? (
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{email}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                Telefone
              </p>
              {editContact ? (
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Dados Adicionais / Preferências */}
        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#fffaf0]/10 pb-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0] uppercase">
              Dados Adicionais & Preferências de Dossiê
            </h3>
            {!editPrefs ? (
              <button
                onClick={() => {
                  setTempShirt(shirtSize)
                  setTempShoe(shoeSize)
                  setTempNotes(notes)
                  setEditPrefs(true)
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#d7b56d] transition-colors hover:text-[#fffaf0]"
              >
                <IconEdit className="size-3.5" /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSavePrefs}
                  className="cursor-pointer text-[#d7b56d] transition-colors hover:text-[#62d84e]"
                >
                  <IconCheck className="size-4" />
                </button>
                <button
                  onClick={() => setEditPrefs(false)}
                  className="cursor-pointer text-[#ffb0a5] transition-colors hover:text-[#fffaf0]"
                >
                  <IconX className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                Tamanho de Camiseta
              </p>
              {editPrefs ? (
                <select
                  value={tempShirt}
                  onChange={(e) => setTempShirt(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                >
                  <option value="PP">PP</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="XG">XG</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{shirtSize}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                Tamanho de Calçado
              </p>
              {editPrefs ? (
                <input
                  type="text"
                  value={tempShoe}
                  onChange={(e) => setTempShoe(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{shoeSize}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wide text-[#bfb4a3] uppercase">
                Observações de Produção
              </p>
              {editPrefs ? (
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  className="mt-1 h-12 w-full resize-none border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              ) : (
                <p className="mt-1 text-sm text-[#f0e8dd]">{notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Endereços */}
        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#fffaf0]/10 pb-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0] uppercase">
              Endereços de Entrega
            </h3>
            {!showAddAddress && (
              <button
                onClick={() => setShowAddAddress(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#d7b56d] transition-colors hover:text-[#fffaf0]"
              >
                <IconPlus className="size-3.5" /> Adicionar Endereço
              </button>
            )}
          </div>

          {/* Form para Adicionar Endereço */}
          {showAddAddress && (
            <form
              onSubmit={handleAddAddress}
              className="mt-4 space-y-4 border border-[#fffaf0]/10 bg-[#0c0a09] p-4"
            >
              <p className="text-xs font-semibold tracking-wide text-[#d7b56d] uppercase">
                Novo Endereço de Entrega
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Identificação (ex: Casa, Trabalho)
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    CEP
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrZip}
                    onChange={(e) => setNewAddrZip(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Logradouro / Rua
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Número
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrNumber}
                    onChange={(e) => setNewAddrNumber(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={newAddrComplement}
                    onChange={(e) => setNewAddrComplement(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Bairro
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrNeighborhood}
                    onChange={(e) => setNewAddrNeighborhood(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#bfb4a3] uppercase">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="mt-1 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 py-1.5 text-sm text-[#fffaf0] outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[#fffaf0]/20 text-[#fffaf0] hover:bg-[#fffaf0]/10"
                  onClick={() => setShowAddAddress(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#d7b56d] text-[#171211] hover:bg-[#c69f54]"
                >
                  Salvar Endereço
                </Button>
              </div>
            </form>
          )}

          {/* Listagem de Endereços */}
          <div className="mt-4 space-y-3">
            {addresses.length === 0 ? (
              <p className="text-sm text-[#bfb4a3] italic">
                Nenhum endereço cadastrado.
              </p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between border border-[#fffaf0]/10 bg-[#0c0a09] p-4 text-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xs font-bold text-[#d7b56d] uppercase">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="border border-[#d7b56d]/30 bg-[#d7b56d]/10 px-1.5 py-0.5 text-[9px] text-[#d7b56d] uppercase">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[#f0e8dd]">
                      {addr.street}, nº {addr.number}{' '}
                      {addr.complement && `(${addr.complement})`}
                    </p>
                    <p className="text-xs text-[#c8bdad]">
                      {addr.neighborhood} — {addr.city}/{addr.state} — CEP{' '}
                      {addr.zipCode}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="cursor-pointer p-1 text-[#ffb0a5] transition-colors hover:text-[#d84132]"
                  >
                    <IconTrash className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
