<?php

namespace App\Http\Services;

use App\Http\Resources\Api\ParticipantResource;
use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ParticipantService
{
    function getUserParticipants()
    {
        $participants = Participant::where('user_id', auth()->user()->id)->get();
        return ParticipantResource::collection($participants);
    }

    function addParticipant($request)
    {
        $participant =  DB::transaction(function () use ($request) {
            $participantData            = $request->validated();
            $participantData["id"]      = get_unique_string();
            $participantData["user_id"] = auth()->user()->id;
            $participantData['dob'] = Carbon::createFromFormat('d-m-Y', $request['dob'])->format("Y-m-d");
            return  Participant::create($participantData);
        });
        return new ParticipantResource($participant);
    }

    function editParticipant($request)
    {
        $participant =  Participant::where('id', $request->participant_id)->firstOrFail();
        return new ParticipantResource($participant);
    }

    function updateParticipant($request)
    {
        $participant =  DB::transaction(function () use ($request) {
            $validateData = $request->validated();
            $validateData['user_id'] = auth()->user()->id; //
            $validateData['dob'] = Carbon::createFromFormat('d-m-Y', $request['dob'])->format("Y-m-d");
            $participant = Participant::where('id', $request->participant_id)->firstOrFail();
            $participant->update($validateData);
            $updatedParticipant =  $participant->refresh();
            return $updatedParticipant;
        });
        return new ParticipantResource($participant);
    }
    function deleteParticipant($request)
    {
        $isDelete =  DB::transaction(function () use ($request) {
            $participant = Participant::where("id", $request->participant_id)->firstOrFail();
            return $participant->delete();
        });
        return $isDelete;
    }
}
