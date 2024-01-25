<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ParticipantRequest;
use App\Http\Services\ParticipantService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParticipantController extends Controller
{
    function participantsList(Request $request, ParticipantService $userService)
    {
        try {
            $this->response["data"] = $userService->getUserParticipants();
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("PARTICIPANT_FETCHED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function addParticipant(ParticipantRequest $request, ParticipantService $userService)
    {
        try {
            $this->response["data"] =  $userService->addParticipant($request);
            $this->status = Response::HTTP_CREATED;
            $this->response["message"] = __("PARTICIPANT_ADDED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function editParticipant(Request $request, ParticipantService $userService)
    {
        try {
            $this->response["data"] =  $userService->editParticipant($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("PARTICIPANT_FETCHED");
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __("PARTICIPANT_NOT_FOUND");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function updateParticipants(ParticipantRequest $request, ParticipantService $userService)
    {
        try {
            $this->response["data"] =  $userService->updateParticipant($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("PARTICIPANT_UPDATED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function deleteParticipant(Request $request, ParticipantService $userService)
    {
        try {
            $this->response["data"] =  $userService->deleteParticipant($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("PARTICIPANT_DELETED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
