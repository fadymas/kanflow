'use client'

import { useId } from 'react'

import { MoonIcon, SunIcon } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useTheme } from 'theme-handler'

const SwitchDualIconLabelDemo = () => {
  const id = useId()
  const { theme, setTheme } = useTheme()
  const toggleSwitch = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="group inline-flex items-center gap-4 text-knetural-default">
      <span
        id={`${id}-light`}
        className={cn(
          '   cursor-pointer text-left text-sm font-medium',
          theme === 'light' ? ' text-black' : 'text-knetural-default'
        )}
        aria-controls={id}
        onClick={() => setTheme('light')}
      >
        <SunIcon className="size-4.5" aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={theme === 'dark'}
        size="default"
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-dark`}
        className={cn(
          ' cursor-pointer text-right text-sm font-medium',
          theme === 'dark' ? 'text-white' : 'text-knetural-default'
        )}
        aria-controls={id}
        onClick={() => setTheme('dark')}
      >
        <MoonIcon className="size-4.5" aria-hidden="true" />
      </span>
    </div>
  )
}

export default SwitchDualIconLabelDemo
