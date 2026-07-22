'use client'

import {
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconMapPin,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Textarea } from '@/src/components/ui/textarea'
import { apiClient } from '@/src/lib/api-client'
import { CepLookupError, lookupCep } from '@/src/lib/cep'
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
import {
  ADDRESS_NUMBER_MAX_LENGTH,
  BRAZILIAN_UFS,
  formatCep,
  formatCpf,
  formatPhone,
  formatUf,
  isValidAddressNumber,
  isValidCep,
  isValidCpf,
  isValidPhone,
  isValidUf,
  normalizeDigits,
  SHIRT_SIZES,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

/** Shared class for inline edit/close action buttons. */
const editBtnClass = `inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] px-2 py-1 text-xs text-(--red) ${transitionBgColor} hover:bg-(--red)/8 hover:text-(--red-deep)`
const saveBtnClass = `cursor-pointer rounded-[9px] p-1.5 text-(--teal) ${transitionBgColor} hover:bg-(--teal)/10`
const cancelBtnClass = `cursor-pointer rounded-[9px] p-1.5 text-(--red) ${transitionBgColor} hover:bg-(--red)/10`

function displayValue(value: string | null | undefined) {
  return value?.trim() ? value : '—'
}

function ProfileLoadingSkeleton() {
  const field = (labelWidth: string, valueWidth: string) => (
    <div className="flex flex-col gap-2">
      <Skeleton className={cn('h-2 rounded bg-(--ink)/8', labelWidth)} />
      <Skeleton className={cn('h-4 rounded bg-(--ink)/8', valueWidth)} />
    </div>
  )

  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando informações da conta...</span>
      <div aria-hidden="true">
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
            <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
              <Skeleton className="h-4 w-40 rounded bg-(--ink)/8" />
              <Skeleton className="h-7 w-16 rounded-[9px] bg-(--ink)/8" />
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {field('w-20', 'w-4/5')}
              {field('w-8', 'w-32')}
              {field('w-10', 'w-24')}
            </div>
          </div>

          <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
            <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
              <Skeleton className="h-4 w-20 rounded bg-(--ink)/8" />
              <Skeleton className="h-7 w-16 rounded-[9px] bg-(--ink)/8" />
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {field('w-12', 'w-5/6')}
              {field('w-16', 'w-36')}
            </div>
          </div>

          <div
            className={`${dossierCardSurface} ${cardShadowBase} p-5 md:col-span-2`}
          >
            <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
              <Skeleton className="h-4 w-64 rounded bg-(--ink)/8" />
              <Skeleton className="h-7 w-16 rounded-[9px] bg-(--ink)/8" />
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              {field('w-28', 'w-10')}
              {field('w-24', 'w-12')}
              {field('w-36', 'w-full')}
            </div>
          </div>

          <div
            className={`${dossierCardSurface} ${cardShadowBase} p-5 md:col-span-2`}
          >
            <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
              <Skeleton className="h-4 w-44 rounded bg-(--ink)/8" />
              <Skeleton className="h-7 w-40 rounded-[9px] bg-(--ink)/8" />
            </div>
            <div className="mt-4 rounded-[10px] border border-(--ink)/10 bg-(--paper-soft) p-4">
              <Skeleton className="h-3 w-16 rounded bg-(--ink)/8" />
              <Skeleton className="mt-3 h-4 w-3/4 rounded bg-(--ink)/8" />
              <Skeleton className="mt-2 h-3 w-2/3 rounded bg-(--ink)/8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PerfilPage() {
  // State for Customer Info
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [shirtSize, setShirtSize] = useState('')
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
  const [lookingUpCep, setLookingUpCep] = useState(false)
  const [cepLookupError, setCepLookupError] = useState<string | null>(null)
  const lastLookedUpCepRef = useRef('')
  const cepLookupAbortRef = useRef<AbortController | null>(null)
  const numberInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<
    'basics' | 'contact' | 'preferences' | null
  >(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savingAddress, setSavingAddress] = useState(false)

  const applyCustomer = (customer: Customer) => {
    const preferences = customer.preferences
    setName(customer.name)
    setPhone(formatPhone(customer.phone || ''))
    setEmail(customer.email)
    setCpf(formatCpf(customer.document || ''))
    setShirtSize(preferences?.shirtSize ?? '')
    setShoeSize(preferences?.shoeSize ?? '')
    setNotes(preferences?.notes ?? '')
    setTempName(customer.name)
    setTempEmail(customer.email)
    setTempPhone(formatPhone(customer.phone || ''))
    setTempShirt(preferences?.shirtSize ?? '')
    setTempShoe(preferences?.shoeSize ?? '')
    setTempNotes(preferences?.notes ?? '')
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
    if (!isValidCpf(tempCpf)) {
      setSaveError('Informe um CPF válido.')
      return
    }

    try {
      setSavingSection('basics')
      setSaveError(null)
      const customer = await apiClient.customer.updateProfile({
        name: tempName,
        document: normalizeDigits(tempCpf),
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
    if (!isValidPhone(tempPhone)) {
      setSaveError('Telefone deve ter 10 ou 11 dígitos.')
      return
    }

    try {
      setSavingSection('contact')
      setSaveError(null)
      const customer = await apiClient.customer.updateProfile({
        email: tempEmail,
        phone: normalizeDigits(tempPhone),
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
    cepLookupAbortRef.current?.abort()
    cepLookupAbortRef.current = null
    lastLookedUpCepRef.current = ''
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
    setLookingUpCep(false)
    setCepLookupError(null)
  }

  const handleEditAddress = (address: Address) => {
    cepLookupAbortRef.current?.abort()
    cepLookupAbortRef.current = null
    lastLookedUpCepRef.current = normalizeDigits(address.zipCode)
    setEditingAddressId(address.id)
    setShowAddAddress(false)
    setNewAddrLabel(address.label)
    setNewAddrStreet(address.street)
    setNewAddrNumber(address.number)
    setNewAddrComplement(address.complement || '')
    setNewAddrNeighborhood(address.neighborhood)
    setNewAddrCity(address.city)
    setNewAddrState(address.state)
    setNewAddrZip(formatCep(address.zipCode))
    setNewAddrIsDefault(address.isDefault)
    setLookingUpCep(false)
    setCepLookupError(null)
    setSaveError(null)
  }

  const fillAddressFromCep = async (digits: string) => {
    if (digits === lastLookedUpCepRef.current) return

    cepLookupAbortRef.current?.abort()
    const controller = new AbortController()
    cepLookupAbortRef.current = controller

    setLookingUpCep(true)
    setCepLookupError(null)

    try {
      const address = await lookupCep(digits, controller.signal)
      if (controller.signal.aborted) return

      lastLookedUpCepRef.current = digits
      if (address.street) setNewAddrStreet(address.street)
      if (address.neighborhood) setNewAddrNeighborhood(address.neighborhood)
      if (address.city) setNewAddrCity(address.city)
      if (address.state) setNewAddrState(formatUf(address.state))
      numberInputRef.current?.focus()
    } catch (error) {
      if (controller.signal.aborted) return
      lastLookedUpCepRef.current = ''
      setCepLookupError(
        error instanceof CepLookupError
          ? error.message
          : 'Não foi possível consultar o CEP.',
      )
    } finally {
      if (cepLookupAbortRef.current === controller) {
        cepLookupAbortRef.current = null
        setLookingUpCep(false)
      }
    }
  }

  const handleZipChange = (value: string) => {
    const formatted = formatCep(value)
    const digits = normalizeDigits(formatted)
    setNewAddrZip(formatted)
    setCepLookupError(null)

    if (digits.length !== 8) {
      lastLookedUpCepRef.current = ''
      cepLookupAbortRef.current?.abort()
      cepLookupAbortRef.current = null
      setLookingUpCep(false)
      return
    }

    void fillAddressFromCep(digits)
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddrLabel || !newAddrStreet || !newAddrNumber || !newAddrZip) return
    if (!isValidCep(newAddrZip)) {
      setSaveError('CEP deve ter 8 dígitos.')
      return
    }
    if (!isValidUf(newAddrState)) {
      setSaveError('Selecione uma UF válida.')
      return
    }
    if (!isValidAddressNumber(newAddrNumber)) {
      setSaveError(
        `Número deve ter no máximo ${ADDRESS_NUMBER_MAX_LENGTH} caracteres.`,
      )
      return
    }

    try {
      setSavingAddress(true)
      setSaveError(null)
      const addressPayload = {
        label: newAddrLabel,
        street: newAddrStreet,
        number: newAddrNumber.trim(),
        complement: newAddrComplement,
        neighborhood: newAddrNeighborhood,
        city: newAddrCity,
        state: formatUf(newAddrState),
        zipCode: normalizeDigits(newAddrZip),
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
      {loading ? (
        <ProfileLoadingSkeleton />
      ) : (
        <>
          {saveError ? (
            <Alert variant="destructive" className="mt-3">
              <IconAlertCircle />
              <AlertTitle>Não foi possível salvar</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempName(name)
                      setTempCpf(cpf)
                      setEditBasics(true)
                    }}
                    className={editBtnClass}
                  >
                    <IconEdit className="size-3.5" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleSaveBasics}
                      className={saveBtnClass}
                      disabled={savingSection === 'basics'}
                      aria-label="Salvar informações básicas"
                    >
                      <IconCheck className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditBasics(false)}
                      className={cancelBtnClass}
                    >
                      <IconX className="size-4" />
                    </Button>
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
                    <Input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className={formInputClass}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(name)}
                    </p>
                  )}
                </div>
                <div>
                  <p
                    className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    CPF
                  </p>
                  {editBasics ? (
                    <Input
                      type="text"
                      value={tempCpf}
                      onChange={(e) => setTempCpf(formatCpf(e.target.value))}
                      inputMode="numeric"
                      maxLength={14}
                      className={formInputClass}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(cpf)}
                    </p>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempEmail(email)
                      setTempPhone(phone)
                      setEditContact(true)
                    }}
                    className={editBtnClass}
                  >
                    <IconEdit className="size-3.5" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleSaveContact}
                      className={saveBtnClass}
                      disabled={savingSection === 'contact'}
                      aria-label="Salvar contato"
                    >
                      <IconCheck className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditContact(false)}
                      className={cancelBtnClass}
                    >
                      <IconX className="size-4" />
                    </Button>
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
                    <Input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className={formInputClass}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(email)}
                    </p>
                  )}
                </div>
                <div>
                  <p
                    className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    Telefone
                  </p>
                  {editContact ? (
                    <Input
                      type="tel"
                      value={tempPhone}
                      onChange={(e) =>
                        setTempPhone(formatPhone(e.target.value))
                      }
                      inputMode="numeric"
                      maxLength={15}
                      className={formInputClass}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(phone)}
                    </p>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempShirt(shirtSize)
                      setTempShoe(shoeSize)
                      setTempNotes(notes)
                      setEditPrefs(true)
                    }}
                    className={editBtnClass}
                  >
                    <IconEdit className="size-3.5" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleSavePrefs}
                      className={saveBtnClass}
                      disabled={savingSection === 'preferences'}
                      aria-label="Salvar preferências"
                    >
                      <IconCheck className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditPrefs(false)}
                      className={cancelBtnClass}
                    >
                      <IconX className="size-4" />
                    </Button>
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
                    <NativeSelect
                      value={tempShirt}
                      onChange={(e) => setTempShirt(e.target.value)}
                      className={formInputClass}
                    >
                      <NativeSelectOption value="">
                        Selecione
                      </NativeSelectOption>
                      {SHIRT_SIZES.map((size) => (
                        <NativeSelectOption key={size} value={size}>
                          {size}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(shirtSize)}
                    </p>
                  )}
                </div>
                <div>
                  <p
                    className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    Tamanho de Calçado
                  </p>
                  {editPrefs ? (
                    <Input
                      type="text"
                      value={tempShoe}
                      onChange={(e) => setTempShoe(e.target.value)}
                      className={formInputClass}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(shoeSize)}
                    </p>
                  )}
                </div>
                <div>
                  <p
                    className={`text-[10px] tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    Observações de Produção
                  </p>
                  {editPrefs ? (
                    <Textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      className={`${formInputClass} h-12 resize-none`}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {displayValue(notes)}
                    </p>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      resetAddressForm()
                      setShowAddAddress(true)
                    }}
                    className={editBtnClass}
                  >
                    <IconPlus className="size-3.5" /> Adicionar Endereço
                  </Button>
                )}
              </div>

              {/* Form para Adicionar Endereço */}
              {(showAddAddress || editingAddressId) && (
                <form
                  onSubmit={handleAddAddress}
                  className="mt-4 rounded-[14px] border border-(--ink)/10 bg-(--paper-soft) p-4"
                >
                  <p
                    className={`text-xs font-semibold tracking-wide text-(--red) uppercase ${fontMono}`}
                  >
                    {editingAddressId
                      ? 'Editar Endereço de Entrega'
                      : 'Novo Endereço de Entrega'}
                  </p>
                  <FieldGroup className="mt-4 gap-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field className="md:col-span-2">
                        <FieldLabel className={formLabelClass}>
                          Identificação (ex: Casa, Trabalho)
                        </FieldLabel>
                        <Input
                          type="text"
                          required
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          className={formInputClass}
                        />
                      </Field>
                      <Field data-invalid={cepLookupError ? true : undefined}>
                        <FieldLabel
                          className={formLabelClass}
                          htmlFor="addr-cep"
                        >
                          CEP
                        </FieldLabel>
                        <Input
                          id="addr-cep"
                          type="text"
                          required
                          value={newAddrZip}
                          onChange={(e) => handleZipChange(e.target.value)}
                          onBlur={() => {
                            if (isValidCep(newAddrZip)) {
                              void fillAddressFromCep(
                                normalizeDigits(newAddrZip),
                              )
                            }
                          }}
                          inputMode="numeric"
                          autoComplete="postal-code"
                          maxLength={9}
                          aria-busy={lookingUpCep}
                          aria-invalid={cepLookupError ? true : undefined}
                          className={formInputClass}
                        />
                        {lookingUpCep ? (
                          <FieldDescription>
                            Buscando endereço...
                          </FieldDescription>
                        ) : null}
                        {cepLookupError ? (
                          <FieldError>{cepLookupError}</FieldError>
                        ) : null}
                      </Field>
                      <Field
                        className="md:col-span-2"
                        data-disabled={lookingUpCep ? true : undefined}
                      >
                        <FieldLabel className={formLabelClass}>
                          Logradouro / Rua
                        </FieldLabel>
                        <Input
                          type="text"
                          required
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          disabled={lookingUpCep}
                          className={formInputClass}
                        />
                      </Field>
                      <Field>
                        <FieldLabel className={formLabelClass}>
                          Número
                        </FieldLabel>
                        <Input
                          ref={numberInputRef}
                          type="text"
                          required
                          value={newAddrNumber}
                          onChange={(e) =>
                            setNewAddrNumber(
                              e.target.value.slice(
                                0,
                                ADDRESS_NUMBER_MAX_LENGTH,
                              ),
                            )
                          }
                          maxLength={ADDRESS_NUMBER_MAX_LENGTH}
                          className={formInputClass}
                        />
                      </Field>
                      <Field>
                        <FieldLabel className={formLabelClass}>
                          Complemento
                        </FieldLabel>
                        <Input
                          type="text"
                          value={newAddrComplement}
                          onChange={(e) => setNewAddrComplement(e.target.value)}
                          className={formInputClass}
                        />
                      </Field>
                      <Field data-disabled={lookingUpCep ? true : undefined}>
                        <FieldLabel className={formLabelClass}>
                          Bairro
                        </FieldLabel>
                        <Input
                          type="text"
                          required
                          value={newAddrNeighborhood}
                          onChange={(e) =>
                            setNewAddrNeighborhood(e.target.value)
                          }
                          disabled={lookingUpCep}
                          className={formInputClass}
                        />
                      </Field>
                      <Field data-disabled={lookingUpCep ? true : undefined}>
                        <FieldLabel className={formLabelClass}>
                          Cidade
                        </FieldLabel>
                        <Input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          disabled={lookingUpCep}
                          className={formInputClass}
                        />
                      </Field>
                      <Field data-disabled={lookingUpCep ? true : undefined}>
                        <FieldLabel className={formLabelClass}>
                          Estado (UF)
                        </FieldLabel>
                        <Select
                          value={newAddrState || undefined}
                          onValueChange={setNewAddrState}
                          disabled={lookingUpCep}
                        >
                          <SelectTrigger
                            className={cn(formInputClass, 'w-full')}
                          >
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectGroup>
                              {BRAZILIAN_UFS.map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                  {uf}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field
                        orientation="horizontal"
                        className="items-center md:col-span-3"
                      >
                        <Checkbox
                          id="addr-default"
                          checked={newAddrIsDefault}
                          onCheckedChange={(checked) =>
                            setNewAddrIsDefault(checked === true)
                          }
                          className="size-4 shrink-0 rounded border border-[rgba(33,28,24,0.15)] bg-transparent data-checked:border-(--red) data-checked:bg-(--red) data-checked:text-[#fbf9f6]"
                        />
                        <FieldLabel
                          htmlFor="addr-default"
                          className="cursor-pointer text-sm leading-none font-normal text-(--ink-soft)"
                        >
                          Definir como endereço principal
                        </FieldLabel>
                      </Field>
                    </div>
                  </FieldGroup>
                  <div className="flex justify-end gap-2 pt-4">
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
                      disabled={savingAddress || lookingUpCep}
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
              <div className="mt-4 flex flex-col gap-3">
                {addresses.length === 0 ? (
                  <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconMapPin />
                      </EmptyMedia>
                      <EmptyTitle>Nenhum endereço cadastrado</EmptyTitle>
                      <EmptyDescription>
                        Adicione um endereço de entrega para receber suas
                        caixas.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
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
                          {formatCep(addr.zipCode)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEditAddress(addr)}
                          className={`rounded-[9px] p-1 text-(--red) ${transitionBgColor} hover:bg-(--red)/10 hover:text-(--red-deep)`}
                          aria-label={`Editar endereço ${addr.label}`}
                        >
                          <IconEdit className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className={`rounded-[9px] p-1 text-(--red) ${transitionBgColor} hover:bg-(--red)/10 hover:text-(--red-deep)`}
                          aria-label={`Excluir endereço ${addr.label}`}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
