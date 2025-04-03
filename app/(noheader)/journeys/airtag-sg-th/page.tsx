import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { ArrowLeft } from 'lucide-react'

import { ThemeToggle } from '../../../../components/ThemeToggle'
import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'
import { AirTagMap } from './AirTagMap'

const { url, title } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, AirTag 🇸🇬 👉 🇹🇭`,
  description:
    'Tracking my stuffs send through relocation service from Singapore to Thailand'
})

const AirTagPage = () => {
  return (
    <main className="main-container">
      <div className="post-header">
        <Link className="post-header-back-link" href="/journeys">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Journeys
        </Link>
        <ThemeToggle />
      </div>
      <div>
        <h1 className="post-title mb-4">AirTag 🇸🇬 👉 🇹🇭</h1>
        <AirTagMap />

        <h2 className="mb-2">Timeline</h2>
        <h3 className="mb-2">11 February 2022</h3>
        <ul className="mb-4">
          <li>
            <strong>09.45 SGT</strong> Packing everything to the box
          </li>
          <li>
            <strong>13.55 SGT</strong> Start moving from my place
          </li>
          <li>
            <strong>14.28 SGT</strong> On PIE near Lornie road
            (1.3257171435842245, 103.83381280084181)
          </li>
          <li>
            <strong>14.59 SGT</strong> Holland Village (103.7959002560278,
            1.311891911778024)
          </li>
          <li>
            <strong>15.27 SGT</strong> On Boonlay way (1.3407441888059786,
            103.71032368715997)
          </li>
          <li>
            <strong>16.11 SGT</strong> K C Dat Logistics pte{' '}
            <Link href="https://g.page/kcdatlogistics?share" target="_blank">
              (1.3245446927261175, 103.69348852496523)
            </Link>
          </li>
        </ul>

        <h3 className="mb-2">12 - 17 February 2022</h3>
        <ul className="mb-4">
          <li>Stay at K C Dat Logistics pte</li>
        </ul>

        <h3 className="mb-2">18 February 2022</h3>
        <ul className="mb-4">
          <li>
            <strong>15.05 ICT</strong> West Coast Highway near harbourfront
            <Link href="https://goo.gl/maps/uS8J1vyZrYrDgoDj9" target="_blank">
              (1.2696481908815793, 103.82772984971787)
            </Link>
          </li>
          <li>
            <strong>10.29 ICT</strong> Load to the ship
          </li>
        </ul>

        <h3 className="mb-2">19 - 22 February 2022</h3>
        <ul className="mb-4">
          <li>In transit somewhere in the sea</li>
        </ul>

        <h3 className="mb-2">23 - 28 February 2022</h3>
        <ul className="mb-4">
          <li>In transit somewhere in Thailand, loading to custom</li>
        </ul>

        <h3 className="mb-2">28 February 2022 - 1 March 2022</h3>
        <ul className="mb-4">
          <li>
            <strong>11.09 ICT</strong> In Thailand Custom at Ladkrabang Cargo
            Control Customs Office{' '}
            <Link href="https://goo.gl/maps/kQRkiK2ZodaxNXYy5" target="_blank">
              (13.740690427182491, 100.7621295498533)
            </Link>
          </li>
        </ul>

        <h3 className="mb-2">2 March 2022</h3>
        <ul className="mb-4">
          <li>
            <strong>09.13 ICT</strong> Moving out from custom
            (13.741084534618823, 100.76725355699101)
          </li>
          <li>
            <strong>09.36 ICT</strong> On the way to warehouse?
            (13.597544044582564, 100.6992644706041)
          </li>
          <li>
            <strong>16.25 ICT</strong> Warehouse atAsian Tigers Mobility
            Training Center{' '}
            <Link href="https://goo.gl/maps/54obUGcLQjfieyhx7" target="_blank">
              (13.55030367015619, 100.69514337047515)
            </Link>
          </li>
        </ul>

        <h3 className="mb-2">3 March 2022</h3>
        <ul className="mb-4">
          <li>Stay at the warehouse</li>
        </ul>

        <h3 className="mb-2">4 March 2022</h3>
        <ul className="mb-4">
          <li>
            <strong>07.00 ICT</strong> Leaving warehouse and move to Nonthaburi?
            (13.886406621322134, 100.52258561534529)
          </li>
          <li>
            <strong>09.49 ICT</strong> Moving to Nichada Thani Village
            (13.891880402541755, 100.5347277124082)
          </li>
          <li>
            <strong>10.46 ICT</strong> Finish first stop (13.8919896424992,
            100.52682739887531)
          </li>
          <li>
            <strong>10.50 ICT</strong> On the way (13.885645124594866,
            100.51966269589431)
          </li>
          <li>
            <strong>10.52 ICT</strong> At the Samakkhi road intersection
            (13.886924461208979, 100.51192060403304)
          </li>
          <li>
            <strong>11.09 ICT</strong> Somehow going back to Samakkhi road
            (13.88745630067037, 100.5229428306387)
          </li>
          <li>
            <strong>11.36 ICT</strong> Chaeng Watthana road (13.906616783921542,
            100.51279570589112)
          </li>
          <li>
            <strong>11.47 ICT</strong> Ratchaphruek road (13.884865023664105,
            100.4520266057727)
          </li>
          <li>
            <strong>11.59 ICT</strong> Arrived (13.880069579016235,
            100.45907251285254)
          </li>
        </ul>
      </div>
      <Link className="post-header-back-link" href="/journeys">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Journeys
      </Link>
    </main>
  )
}

export default AirTagPage
