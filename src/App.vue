<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white dark:bg-gray-900">
    <body class="h-full">
    ```
  -->
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="" leave="transition-opacity ease-linear duration-300" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="" leave="ease-in-out duration-300" leave-from="" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
                <div class="relative flex h-16 shrink-0 items-center">
                    <RouterLink
                      to="/"
                      class="inline-flex items-center gap-2"
                      aria-label="GeoBrewery home"
                    >
                      <!-- Logo (handles dark mode with Tailwind) -->
                      <img class="h-8 w-auto dark:hidden" :src="BrewLogo" alt="GeoBrewery" />
                      <img class="hidden h-8 w-auto dark:block" :src="BrewLogo" alt="GeoBrewery (dark)" />

                      <!-- Wordmark -->
                      <span class="text-lg font-semibold tracking-tight leading-none text-gray-900 dark:text-gray-100">
                        <span class="text-green-600 dark:text-green-400">Geo</span>Brewery
                      </span>
                    </RouterLink>
                </div>
                <nav class="relative flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a :href="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs/6 font-semibold text-gray-400 dark:text-gray-500">Your teams</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a :href="team.href" :class="[team.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <span :class="[team.current ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white' : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white', 'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5']">{{ team.initial }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
        <div class="relative flex h-16 shrink-0 items-center">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-2"
            aria-label="GeoBrewery home"
          >
            <!-- Logo (handles dark mode with Tailwind) -->
            <img class="h-8 w-auto dark:hidden" :src="BrewLogo" alt="GeoBrewery" />
            <img class="hidden h-8 w-auto dark:block" :src="BrewLogo" alt="GeoBrewery (dark)" />

            <!-- Wordmark -->
            <span class="text-lg font-semibold tracking-tight leading-none text-gray-900 dark:text-gray-100">
              <span class="text-green-600 dark:text-green-400">Geo</span>Brewery
            </span>
          </RouterLink>
        </div>
        <nav class="relative flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a :href="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="text-xs/6 font-semibold text-gray-400 dark:text-gray-500">Your teams</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a :href="team.href" :class="[team.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <span :class="[team.current ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white' : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white', 'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5']">{{ team.initial }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                <img class="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">Tom Cook</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-b dark:before:border-white/10 dark:before:bg-black/10">
      <button type="button" class="relative -m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-400" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="relative flex-1 text-sm/6 font-semibold text-gray-900 dark:text-white">Dashboard</div>
      <a href="#" class="relative">
        <span class="sr-only">Your profile</span>
        <img class="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
      </a>
    </div>

    <main class="lg:pl-72 flex flex-col h-screen">
      <div :class="['flex-1 overflow-hidden transition-[padding] duration-200', detailsOpen ? 'xl:pr-96' : '']">
        <Map ref="mapRef" @city-selected="onCitySelected" />
      </div>
    </main>

  <aside
    v-show="detailsOpen"
    class="fixed inset-y-0 right-0 w-96 overflow-y-auto border-l border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-gray-900"
  >
    <div class="flex items-start justify-between">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">Location details</h2>
      <button @click="closeDetails" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10">
        <XMarkIcon class="size-5" />
        <span class="sr-only">Close panel</span>
      </button>
    </div>

    <div v-if="selectedCity" class="mt-6 space-y-6">
      <div>
        <div class="text-lg font-semibold">{{ selectedCity.name }}</div>
        <div class="mt-1 text-sm text-gray-500">ID: {{ selectedCity.id }}</div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10">
          <div class="text-xs text-gray-500">Sales</div>
          <div class="text-xl font-semibold">${{ selectedCity.sales.toLocaleString() }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10">
          <div class="text-xs text-gray-500">Growth</div>
          <div :class="['text-xl font-semibold', selectedCity.growthPct >= 0 ? 'text-emerald-600' : 'text-rose-600']">
            {{ selectedCity.growthPct.toFixed(1) }}%
          </div>
        </div>
      </div>

      <dl class="divide-y divide-gray-200 dark:divide-white/10 rounded-lg border border-gray-200 dark:border-white/10">
        <div class="grid grid-cols-3 gap-4 p-3">
          <dt class="text-sm text-gray-500">Latitude</dt>
          <dd class="col-span-2 text-sm font-medium">{{ selectedCity.lat }}</dd>
        </div>
        <div class="grid grid-cols-3 gap-4 p-3">
          <dt class="text-sm text-gray-500">Longitude</dt>
          <dd class="col-span-2 text-sm font-medium">{{ selectedCity.lng }}</dd>
        </div>
        <!-- add more fields here as needed -->
      </dl>
    </div>

    <div v-else class="mt-6 text-sm text-gray-500">
      Click a city to see details.
    </div>
  </aside>

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import Map from '@/components/Map.vue'
import BrewLogo from '@/assets/globe_logo.svg'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

const sidebarOpen = ref(false)          // left mobile sidebar
const detailsOpen = ref(false)          // right details panel (xl+)
const selectedCity = ref<any>(null)     // holds the clicked city’s data

const mapRef = ref<InstanceType<typeof Map> | null>(null)

async function onCitySelected(p: any) {
  selectedCity.value = p
  detailsOpen.value = true
  // let the panel render, then tell Leaflet to recompute size
  await nextTick()
  // pad the middle area via class (see template), then invalidatesize:
  mapRef.value?.resize()
  mapRef.value?.recenterOn(selectedCity.value.lat, selectedCity.value.lng)

}

function closeDetails() {
  detailsOpen.value = false
}
</script>