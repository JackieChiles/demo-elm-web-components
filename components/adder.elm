port module Genesys.Adder exposing (..)

import Html exposing (Html, input, text, div)
import Html.Attributes exposing (type_, class)
import Html.Events exposing (onInput)
import Json.Encode exposing (Value)
import Json.Decode as Decode
import String exposing (toInt)

main =
  Html.program
    { init = (model, Cmd.none)
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

stringToInt : String -> Int
stringToInt str =
  case toInt str of
    Ok val ->
      val
    Err _ ->
      0

-- PORTS

port left_subscribe : Int -> Cmd msg
port right_subscribe : Int -> Cmd msg

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model = Sub.batch
  [ 
  ]

-- MODEL

type alias Model = { left: Int, right: Int, sum: Int }

model : Model
model =
  Model 0 0 0

-- UPDATE

type Msg = LeftChange Int | RightChange Int

update : Msg -> Model -> (Model, Cmd msg)
update msg model =
  case msg of
    LeftChange value ->
      ({ model | left = value, sum = model.right + value }, left_subscribe value)
    RightChange value ->
      ({ model | right = value, sum = model.left + value }, right_subscribe value)

-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ input [ type_ "number", class "left", onInput (\str -> stringToInt str |> LeftChange) ] []
    , text " + "
    , input [ type_ "number", class "right", onInput (\str -> stringToInt str |> RightChange) ] []
    , text " = "
    , text (toString model.sum)
    ]
