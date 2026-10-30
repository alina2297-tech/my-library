<script setup lang="ts">
import { getErrorMessage } from '@/api/http'
import closeIcon from '@/assets/modal-close.svg'
import imageIcon from '@/assets/modal-image.svg'
import resizeIcon from '@/assets/modal-resize.svg'
import { useStorageLocationsStore } from '@/stores/storageLocations.store'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_PHOTO_SIZE = 5 * 1024 * 1024

const open = defineModel<boolean>({ required: true })

const store = useStorageLocationsStore()

const dialogRef = ref<HTMLElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const title = ref('')
const description = ref('')
const address = ref('')
const photo = ref<File | null>(null)
const photoUrl = ref('')
const isDragOver = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

let returnFocus: HTMLElement | null = null

function setPageScrollLocked(locked: boolean): void {
  const overflow = locked ? 'hidden' : ''
  document.documentElement.style.overflow = overflow
  document.body.style.overflow = overflow
}

function setPhoto(file: File | null): void {
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
  photo.value = file
  photoUrl.value = file ? URL.createObjectURL(file) : ''
}

function resetForm(): void {
  title.value = ''
  description.value = ''
  address.value = ''
  submitError.value = ''
  isDragOver.value = false
  setPhoto(null)

  if (fileInput.value) fileInput.value.value = ''
}

function close(): void {
  if (isSubmitting.value) return
  open.value = false
}

function takePhoto(file: File | undefined): void {
  if (!file) return

  if (!ALLOWED_PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_SIZE) {
    submitError.value = 'Можно загрузить JPEG, PNG или WebP размером до 5 МБ'
    return
  }

  submitError.value = ''
  setPhoto(file)
}

function onFileChange(event: Event): void {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return
  takePhoto(input.files?.[0])
}

function onDrop(event: DragEvent): void {
  isDragOver.value = false
  takePhoto(event.dataTransfer?.files[0])
}

function openFilePicker(): void {
  fileInput.value?.click()
}

function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled') || element.tabIndex < 0) return false
  return element.getClientRects().length > 0
}

function onDialogKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key !== 'Tab' || !dialogRef.value) return

  const focusable = [...dialogRef.value.querySelectorAll<HTMLElement>('button, input, textarea')].filter(
    isFocusable,
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

async function submit(): Promise<void> {
  const titleValue = title.value.trim()
  const addressValue = address.value.trim()
  if (!titleValue || !addressValue || isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    await store.createLocation(
      {
        title: titleValue,
        description: description.value.trim() || undefined,
        address: addressValue,
      },
      photo.value ?? undefined,
    )
    open.value = false
  } catch (err) {
    submitError.value = getErrorMessage(err)
    store.error = null
  } finally {
    isSubmitting.value = false
  }
}

watch(open, (isOpen) => {
  setPageScrollLocked(isOpen)

  if (!isOpen) {
    setPhoto(null)
    returnFocus?.focus()
    returnFocus = null
    return
  }

  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  resetForm()
  void nextTick(() => {
    titleInput.value?.focus()
  })
})

onBeforeUnmount(() => {
  setPageScrollLocked(false)
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @mousedown.self="close">
      <div
        ref="dialogRef"
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="storage-location-modal-title"
        @keydown="onDialogKeydown"
      >
        <form class="form" @submit.prevent="submit">
          <div class="dialog-header">
            <h2 id="storage-location-modal-title" class="title">Новое место хранения</h2>
            <button type="button" class="close" aria-label="Закрыть" @click="close">
              <img class="close-icon" :src="closeIcon" alt="" width="20.0607" height="20.0607" />
            </button>
          </div>

          <label class="field">
            <span class="label">Название *</span>
            <input
              ref="titleInput"
              v-model="title"
              class="control"
              type="text"
              name="title"
              maxlength="50"
              required
              autocomplete="off"
              placeholder="Например, Шкаф 1"
            />
          </label>

          <label class="field">
            <span class="label">Описание</span>
            <span class="area">
              <textarea
                v-model="description"
                class="control control--area"
                name="description"
                maxlength="255"
                placeholder="Краткое описание места хранения (по желанию)"
              />
              <span class="resize" aria-hidden="true">
                <img :src="resizeIcon" alt="" width="6.56569" height="6.56569" />
              </span>
            </span>
          </label>

          <label class="field field--address">
            <span class="label">Где находится *</span>
            <input
              v-model="address"
              class="control"
              type="text"
              name="address"
              maxlength="255"
              required
              autocomplete="off"
              placeholder="Например, зал"
            />
          </label>

          <div class="field">
            <span class="label">Изображение</span>
            <div
              class="upload"
              :class="{ 'is-dragover': isDragOver }"
              @dragenter.prevent="isDragOver = true"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="onDrop"
            >
              <input
                ref="fileInput"
                class="file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                tabindex="-1"
                aria-hidden="true"
                @change="onFileChange"
              />
              <button type="button" class="dropzone" @click="openFilePicker">
                <img v-if="photoUrl" class="preview" :src="photoUrl" alt="" />
                <template v-else>
                  <img class="image-icon" :src="imageIcon" alt="" width="32" height="32" />
                  <span class="drop-title">Добавить изображение</span>
                  <span class="drop-hint">или перетащите файл</span>
                </template>
              </button>
            </div>
          </div>

          <p v-if="submitError" class="form-error" role="alert">{{ submitError }}</p>

          <div class="actions">
            <button type="button" class="cancel" @click="close">Отмена</button>
            <button type="submit" class="save" :disabled="isSubmitting">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: safe center;
  justify-content: safe center;
  padding: 32px;
  overflow: auto;
  background: rgb(36 74 115 / 10%);
}

.dialog {
  flex-shrink: 0;
  width: min(634px, 100%);
  padding: 27px 43px 36px;
  overflow: hidden;
  border: 1px solid #d4e3f0;
  border-radius: 17px;
  background: #f2f8fe;
  box-shadow: 0 16px 40px rgb(55 86 117 / 13%);
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dialog-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  min-width: 0;
  font-family: Lora, Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 48px;
  color: #244a73;
}

.close,
.dropzone,
.cancel,
.save {
  margin: 0;
  font-family: Arimo, Arial, sans-serif;
  font-weight: 400;
  cursor: pointer;
}

.close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  margin: 7px -13px 0 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.close:hover,
.dropzone:hover,
.cancel:hover {
  background: transparent;
}

.close-icon,
.image-icon,
.resize img {
  display: block;
  max-width: none;
}

.close-icon {
  width: 20.0607px;
  height: 20.0607px;
}

.image-icon {
  width: 32px;
  height: 32px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field + .field {
  margin-top: 27px;
}

.field.field--address {
  margin-top: 32px;
}

.label {
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  color: #6184ab;
}

.control {
  display: block;
  width: 100%;
  height: 47px;
  margin: 0;
  padding: 0 16px;
  border: 1px solid #c6d9ee;
  border-radius: 7px;
  background: rgb(255 255 255 / 19%);
  color: #244a73;
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
}

.control::placeholder {
  color: #9cb1cb;
  opacity: 1;
}

.control--area {
  height: 110px;
  padding: 13px 16px;
  resize: none;
}

.area {
  position: relative;
  display: block;
  line-height: 0;
}

.resize {
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 6px;
  height: 6px;
  overflow: visible;
  pointer-events: none;
}

.resize img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6.56569px;
  height: 6.56569px;
  transform: translate(-50%, -50%);
}

.upload {
  position: relative;
}

.upload.is-dragover .dropzone {
  background: rgb(255 255 255 / 45%);
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.dropzone {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 148px;
  padding: 0;
  overflow: hidden;
  border: 1px dashed #c6d9ee;
  border-radius: 7px;
  background: transparent;
  color: #7d9fc4;
}

.drop-title,
.drop-hint {
  font-family: Arimo, Arial, sans-serif;
  font-weight: 400;
  line-height: normal;
  color: #7d9fc4;
}

.drop-title {
  font-size: 16px;
}

.drop-hint {
  font-size: 14px;
}

.preview {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}

.form-error {
  margin-top: 16px;
  font-family: Arimo, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: #8d2e26;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel,
.save {
  width: 161px;
  height: 48px;
  padding: 0;
  border-radius: 40px;
  font-size: 16px;
  line-height: normal;
}

.cancel {
  border: 1px solid #c6d9ee;
  background: transparent;
  color: #244a73;
}

.save {
  border: 0;
  background: #809fc0;
  color: #fff;
}

.save:hover:not(:disabled) {
  background: #809fc0;
}
</style>
