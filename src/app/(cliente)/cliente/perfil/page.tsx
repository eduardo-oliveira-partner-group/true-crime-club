'use client'

import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  formInputClass,
  formLabelClass,
  transitionBgColor,
} from '@/src/lib/design/classes'
import type { Address, Customer } from '@/src/lib/domain/types'

/** Shared class for inline edit/close action buttons. */
const editBtnClass = `inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] px-2 py-1 text-xs text-(--red) ${transitionBgColor} hover:bg-(--red)/8 hover:text-(--red-deep)`
const saveBtnClass = `cursor-pointer rounded-[9px] p-1.5 text-(--teal) ${transitionBgColor} hover:bg-(--teal)/10`
const cancelBtnClass = `cursor-pointer rounded-[9px] p-1.5 text-(--red) ${transitionBgColor} hover:bg-(--red)/10`

export default function PerfilPage() {
  // State for Customer Info
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [shirtSize, setShirtSize] = useState('M')
  const [shoeSize, setShoeSize] = useState('')
  const [notes, setNotes] = useState('')

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
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<
    'basics' | 'contact' | 'preferences' | null
  >(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savingAddress, setSavingAddress] = useState(false)

  const applyCustomer = (customer: Customer) => {
    const preferences = customer.preferences
    setName(customer.name)
    setPhone(customer.phone || '')
    setEmail(customer.email)
    setCpf(customer.document || '')
    setShirtSize(preferences?.shirtSize || 'M')
    setShoeSize(preferences?.shoeSize || '')
    setNotes(preferences?.notes || '')
    setTempName(customer.name)
    setTempEmail(customer.email)
    setTempPhone(customer.phone || '')
    setTempShirt(preferences?.shirtSize || 'M')
    setTempShoe(preferences?.shoeSize || '')
    setTempNotes(preferences?.notes || '')
  }

  useEffect(() => {
    apiClient.customer
      .getProfile()
      .then((data) => {
        if (data.customer) {
          applyCustomer(data.customer)
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
      setSavingSection('basics')
      setSaveError(null)
      const customer = await apiClient.customer.updateProfile({
        name: tempName,
        document: tempCpf,
      })
      applyCustomer(customer)
      setEditBasics(false)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar os dados.',
      )
    } finally {
      setSavingSection(null)
    }
  }

  const handleSaveContact = async () => {
    try {
      setSavingSection('contact')
      setSaveError(null)
      const customer = await apiClient.customer.updateProfile({
        email: tempEmail,
        phone: tempPhone,
      })
      applyCustomer(customer)
      setEditContact(false)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar os dados.',
      )
    } finally {
      setSavingSection(null)
    }
  }

  const handleSavePrefs = async () => {
    try {
      setSavingSection('preferences')
      setSaveError(null)
      const customer = await apiClient.customer.updateProfile({
        preferences: {
          shirtSize: tempShirt,
          shoeSize: tempShoe,
          notes: tempNotes,
        },
      })
      applyCustomer(customer)
      setEditPrefs(false)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar os dados.',
      )
    } finally {
      setSavingSection(null)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      setSaveError(null)
      const updatedList = await apiClient.customer.deleteAddress(id)
      setAddresses(updatedList)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o endereço.',
      )
    }
  }

  const resetAddressForm = () => {
    setShowAddAddress(false)
    setEditingAddressId(null)
    setNewAddrLabel('')
    setNewAddrStreet('')
    setNewAddrNumber('')
    setNewAddrComplement('')
    setNewAddrNeighborhood('')
    setNewAddrCity('')
    setNewAddrState('')
    setNewAddrZip('')
    setNewAddrIsDefault(false)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id)
    setShowAddAddress(false)
    setNewAddrLabel(address.label)
    setNewAddrStreet(address.street)
    setNewAddrNumber(address.number)
    setNewAddrComplement(address.complement || '')
    setNewAddrNeighborhood(address.neighborhood)
    setNewAddrCity(address.city)
    setNewAddrState(address.state)
    setNewAddrZip(address.zipCode)
    setNewAddrIsDefault(address.isDefault)
    setSaveError(null)
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddrLabel || !newAddrStreet || !newAddrNumber || !newAddrZip) return

    try {
      setSavingAddress(true)
      setSaveError(null)
      const addressPayload = {
        label: newAddrLabel,
        street: newAddrStreet,
        number: newAddrNumber,
        complement: newAddrComplement,
        neighborhood: newAddrNeighborhood,
        city: newAddrCity,
        state: newAddrState,
        zipCode: newAddrZip,
        isDefault: newAddrIsDefault,
      }
      const updatedList = editingAddressId
        ? await apiClient.customer.updateAddress(
            editingAddressId,
            addressPayload,
          )
        : await apiClient.customer.addAddress(addressPayload)

      setAddresses(updatedList)
      resetAddressForm()
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o endereço.',
      )
    } finally {
      setSavingAddress(false)
    }
  }

  if (loading) {
    return (
      <div
        className={`flex h-48 animate-pulse items-center justify-center text-sm tracking-widest text-(--ink-mute) uppercase ${fontMono}`}
      >
        Carregando informações da conta...
      </div>
    )
  }

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Minha conta
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Gerencie suas informações cadastrais, de contato, preferências do clube
        e endereços de entrega das suas caixas.
      </p>
      {saveError ? (
        <p className="mt-3 text-sm text-(--red)" role="alert">
          {saveError}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Card 1: Informações Básicas */}
        <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
          <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Informações Básicas
            </h3>
            {!editBasics ? (
              <button
                onClick={() => {
                  setTempName(name)
                  setTempCpf(cpf)
                  setEditBasics(true)
                }}
                className={editBtnClass}
              >
                <IconEdit className="size-3.5" /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBasics}
                  className={saveBtnClass}
                  disabled={savingSection === 'basics'}
                  aria-label="Salvar informações básicas"
                >
                  <IconCheck className="size-4" />
                </button>
                <button
                  onClick={() => setEditBasics(false)}
                  className={cancelBtnClass}
                >
                  <IconX className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Nome Completo
              </p>
              {editBasics ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={formInputClass}
                />
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{name}</p>
              )}
            </div>
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                CPF
              </p>
              {editBasics ? (
                <input
                  type="text"
                  value={tempCpf}
                  onChange={(e) => setTempCpf(e.target.value)}
                  className={formInputClass}
                />
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{cpf}</p>
              )}
            </div>
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Senha
              </p>
              <p className="mt-1 text-sm text-(--ink-mute) italic">
                •••••••• (Edição restrita)
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Contato */}
        <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
          <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Contato
            </h3>
            {!editContact ? (
              <button
                onClick={() => {
                  setTempEmail(email)
                  setTempPhone(phone)
                  setEditContact(true)
                }}
                className={editBtnClass}
              >
                <IconEdit className="size-3.5" /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveContact}
                  className={saveBtnClass}
                  disabled={savingSection === 'contact'}
                  aria-label="Salvar contato"
                >
                  <IconCheck className="size-4" />
                </button>
                <button
                  onClick={() => setEditContact(false)}
                  className={cancelBtnClass}
                >
                  <IconX className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                E-mail
              </p>
              {editContact ? (
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className={formInputClass}
                />
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{email}</p>
              )}
            </div>
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Telefone
              </p>
              {editContact ? (
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className={formInputClass}
                />
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Dados Adicionais / Preferências */}
        <div
          className={`${dossierCardSurface} ${cardShadowBase} p-5 md:col-span-2`}
        >
          <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
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
                className={editBtnClass}
              >
                <IconEdit className="size-3.5" /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSavePrefs}
                  className={saveBtnClass}
                  disabled={savingSection === 'preferences'}
                  aria-label="Salvar preferências"
                >
                  <IconCheck className="size-4" />
                </button>
                <button
                  onClick={() => setEditPrefs(false)}
                  className={cancelBtnClass}
                >
                  <IconX className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Tamanho de Camiseta
              </p>
              {editPrefs ? (
                <select
                  value={tempShirt}
                  onChange={(e) => setTempShirt(e.target.value)}
                  className={formInputClass}
                >
                  <option value="PP">PP</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="XG">XG</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{shirtSize}</p>
              )}
            </div>
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Tamanho de Calçado
              </p>
              {editPrefs ? (
                <input
                  type="text"
                  value={tempShoe}
                  onChange={(e) => setTempShoe(e.target.value)}
                  className={formInputClass}
                />
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{shoeSize}</p>
              )}
            </div>
            <div>
              <p
                className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Observações de Produção
              </p>
              {editPrefs ? (
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  className={`${formInputClass} h-12 resize-none`}
                />
              ) : (
                <p className="mt-1 text-sm text-(--ink-soft)">{notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Endereços */}
        <div
          className={`${dossierCardSurface} ${cardShadowBase} p-5 md:col-span-2`}
        >
          <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Endereços de Entrega
            </h3>
            {!showAddAddress && !editingAddressId && (
              <button
                onClick={() => {
                  resetAddressForm()
                  setShowAddAddress(true)
                }}
                className={editBtnClass}
              >
                <IconPlus className="size-3.5" /> Adicionar Endereço
              </button>
            )}
          </div>

          {/* Form para Adicionar Endereço */}
          {(showAddAddress || editingAddressId) && (
            <form
              onSubmit={handleAddAddress}
              className="mt-4 space-y-4 rounded-[14px] border border-(--ink)/10 bg-(--paper-soft) p-4"
            >
              <p
                className={`text-xs font-semibold tracking-wide text-(--red) uppercase ${fontMono}`}
              >
                {editingAddressId
                  ? 'Editar Endereço de Entrega'
                  : 'Novo Endereço de Entrega'}
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className={formLabelClass}>
                    Identificação (ex: Casa, Trabalho)
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className={formLabelClass}>CEP</label>
                  <input
                    type="text"
                    required
                    value={newAddrZip}
                    onChange={(e) => setNewAddrZip(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={formLabelClass}>Logradouro / Rua</label>
                  <input
                    type="text"
                    required
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className={formLabelClass}>Número</label>
                  <input
                    type="text"
                    required
                    value={newAddrNumber}
                    onChange={(e) => setNewAddrNumber(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className={formLabelClass}>Complemento</label>
                  <input
                    type="text"
                    value={newAddrComplement}
                    onChange={(e) => setNewAddrComplement(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className={formLabelClass}>Bairro</label>
                  <input
                    type="text"
                    required
                    value={newAddrNeighborhood}
                    onChange={(e) => setNewAddrNeighborhood(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className={formLabelClass}>Cidade</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className={formLabelClass}>Estado (UF)</label>
                  <input
                    type="text"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div className="flex items-center md:col-span-3">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm leading-none text-(--ink-soft)">
                    <input
                      type="checkbox"
                      checked={newAddrIsDefault}
                      onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                      className="size-4 shrink-0 rounded border border-[rgba(33,28,24,0.15)] accent-(--red)"
                    />
                    Definir como endereço principal
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-[9px]"
                  onClick={resetAddressForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
                  disabled={savingAddress}
                >
                  {savingAddress
                    ? 'Salvando...'
                    : editingAddressId
                      ? 'Salvar Alterações'
                      : 'Salvar Endereço'}
                </Button>
              </div>
            </form>
          )}

          {/* Listagem de Endereços */}
          <div className="mt-4 space-y-3">
            {addresses.length === 0 ? (
              <p className="text-sm text-(--ink-mute) italic">
                Nenhum endereço cadastrado.
              </p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between rounded-[10px] border border-(--ink)/10 bg-(--paper-soft) p-4 text-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold text-(--red) uppercase ${fontHeading}`}
                      >
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="rounded-[2px] border border-(--teal)/30 bg-(--teal)/10 px-1.5 py-0.5 text-[9px] text-(--teal) uppercase">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-(--ink-soft)">
                      {addr.street}, nº {addr.number}{' '}
                      {addr.complement && `(${addr.complement})`}
                    </p>
                    <p className="text-xs text-(--ink-mute)">
                      {addr.neighborhood} — {addr.city}/{addr.state} — CEP{' '}
                      {addr.zipCode}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className={`rounded-[9px] p-1 text-(--red) ${transitionBgColor} hover:bg-(--red)/10 hover:text-(--red-deep)`}
                      aria-label={`Editar endereço ${addr.label}`}
                    >
                      <IconEdit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className={`rounded-[9px] p-1 text-(--red) ${transitionBgColor} hover:bg-(--red)/10 hover:text-(--red-deep)`}
                      aria-label={`Excluir endereço ${addr.label}`}
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
