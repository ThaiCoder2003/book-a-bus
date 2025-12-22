import convertAction from '@/actions/convertAction'
import { Button } from '@/components/ui/button'
import type { TripInTripList } from '@/types/tripInTripList.type'
import { MapPin, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TripCard({ trip }: { trip: TripInTripList }) {
    let originTime = convertAction.convertTime(trip.pickupTime)
    let destTime = convertAction.convertTime(trip.arrivalTime)
    let durationParsed = convertAction.parseDuration(trip.duration)

    const navigate = useNavigate()

    return (
        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Bus Image */}
                {/* <div className="shrink-0">
                    <img
                        src={trip.image || '/placeholder.svg'}
                        alt={trip.operator}
                        className="w-24 h-20 object-cover rounded-md"
                    />
                </div> */}

                {/* Trip Details */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">
                                {trip.busName}
                            </h3>
                            {/* <p className="text-sm text-muted-foreground">
                                {busType}
                            </p> */}
                        </div>
                        {/* <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span className="font-semibold text-foreground">
                                    {trip.rating}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({trip.reviews})
                                </span>
                            </div>
                        </div> */}
                    </div>

                    {/* Route and Time */}
                    <div className="flex items-center gap-8 mb-3">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <div className="font-semibold text-foreground">
                                    {originTime.day}
                                    <span className="text-primary ml-2">
                                        {originTime.time}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {trip.fromStation}, {trip.fromProvince}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-muted-foreground mb-1">
                                {durationParsed.minutes === 0
                                    ? durationParsed.hours + 'h'
                                    : durationParsed.hours +
                                      'h ' +
                                      durationParsed.minutes +
                                      'm'}
                            </div>
                            <div className="w-full border-t border-border"></div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-semibold text-foreground">
                                    <span className="text-primary mr-2">
                                        {destTime.time}
                                    </span>
                                    {destTime.day}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {trip.toStation}, {trip.toProvince}
                                </div>
                            </div>
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Price and CTA */}
                <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Từ</div>
                        <div className="text-2xl font-bold text-primary">
                            {(trip.price / 1000).toFixed(0)}.000 VNĐ
                        </div>
                        <div className="text-xs text-muted-foreground">
                            đ/vé
                        </div>
                    </div>
                    <Button onClick={() => {
                        navigate(`/trip/${trip.id}`)
                    }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Chọn
                    </Button>
                </div>
            </div>
        </div>
    )
}
