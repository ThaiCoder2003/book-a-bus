import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react'
import type { Trip } from '@/types/trip.type'
import convertAction from '@/actions/convertAction'

export function TripInfo({ trip }: { trip: Trip }) {
    let originTime = convertAction.convertTime(trip.departureTime)
    let destTime = convertAction.convertTime(trip.arrivalTime)
    let busType = convertAction.mappingBusType(trip.bus?.type)

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            {trip.bus?.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                            <Badge variant="secondary" className="mr-2">
                                {busType}
                            </Badge>
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className="text-base font-semibold"
                    >
                        {trip.bus?.plateNumber}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Route Info */}
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="h-4 w-4" />
                            <span>Điểm đi</span>
                        </div>
                        <p className="font-semibold text-lg">
                            {trip.originStation?.province}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {trip.originStation?.name}
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <ArrowRight className="h-5 w-5 text-primary" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {trip.minutesTime === 0
                                ? trip.hoursTime + 'h'
                                : trip.hoursTime +
                                  'h ' +
                                  trip.minutesTime +
                                  'm'}
                        </span>
                    </div>

                    <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
                            <span>Điểm đến</span>
                            <MapPin className="h-4 w-4" />
                        </div>
                        <p className="font-semibold text-lg">
                            {trip.destStation?.province}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {trip.destStation?.name}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Time Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Ngày đi
                            </p>
                            <p className="font-semibold">{originTime.day}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Giờ xuất bến
                            </p>
                            <p className="font-semibold">{originTime.time}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Giờ đến dự kiến
                            </p>
                            <p className="font-semibold">
                                {destTime.time + ' ' + destTime.day}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />
            </CardContent>
        </Card>
    )
}

export default TripInfo
