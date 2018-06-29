port module NumericStepper exposing (..)

import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Json.Encode exposing (Value)
import Json.Decode as Decode

main =
  Html.program
    { init = (model, Cmd.none)
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

-- PORTS

port valueChanged : Model -> Cmd msg
port set : (Value -> msg) -> Sub msg

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  set (decodeValue)

decodeValue val =
  let
    result =
      Decode.decodeValue Decode.int val
  in
    case result of
      Ok int ->
        Set int
      Err _ ->
        Noop

-- MODEL

type alias Model = Int

model : Model
model =
  0

-- UPDATE

sendValueChanged : Model -> (Model, Cmd msg)
sendValueChanged value =
  (value, valueChanged (value))

type Msg = Increment | Decrement | Reset | Set Model | Noop

update : Msg -> Model -> (Model, Cmd msg)
update msg model =
  case msg of
    Increment ->
      sendValueChanged (model + 1)

    Decrement ->
      sendValueChanged (model - 1)

    Reset ->
      sendValueChanged 0

    Set value ->
      sendValueChanged value

    Noop ->
      (model, Cmd.none)

-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    , div [] [ button [ onClick Reset ] [ text "Reset" ] ]
    , div [] [ button [ onClick (Set 5) ] [ text "Set to 5" ] ]
    ]
