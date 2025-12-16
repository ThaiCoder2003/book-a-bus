import convertAction from '@/actions/convertAction'
import { Button } from '@/components/ui/button'
import type { Trip } from '@/types/trip.type'
import { MapPin, Clock } from 'lucide-react'

export default function TripCard({ trip }: { trip: Trip }) {
    let originTime = convertAction.convertTime(trip.departureTime)
    let destTime = convertAction.convertTime(trip.arrivalTime)
    let busType = convertAction.mappingBusType(trip.bus?.type)

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
                                {trip.bus?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {busType}
                            </p>
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
                                    <span className='text-primary ml-2'>
                                        {originTime.time}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {trip.originStation?.province}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-muted-foreground mb-1">
                                {trip.minutesTime === 0
                                    ? trip.hoursTime + 'h'
                                    : trip.hoursTime +
                                      'h ' +
                                      trip.minutesTime +
                                      'm'}
                            </div>
                            <div className="w-full border-t border-border"></div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-semibold text-foreground">
                                    <span className='text-primary mr-2'>
                                        {destTime.time}
                                    </span>
                                    {destTime.day}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {trip.destStation?.province}
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
                            {(trip.basePrice / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">
                            đ/vé
                        </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Chọn
                    </Button>
                </div>
            </div>
        </div>
    )
}
