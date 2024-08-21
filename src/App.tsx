import { useRef, useState } from 'react';
import './styles.css';
import imageO from './assets/imageO.png'
import imageX from './assets/imageX.png'

/*
  DESAFIO TÉCNICO - JOGO DA VELHA - por fernandev

  * descrição
    desenvolva um jogo da velha (tic tac toe) funcional.
    use qualquer técnica de estilização preferida: css modules, sass, styled.

  * tasks
    ? - crie um board de 3x3
    ? - dois jogadores
    ? - ao clicar em um quadrado, preencher com a jogada
    ? - avisar quando o jogo finalizar, caso dê velha avise também
*/

interface Cell{
  row:number,
  column:number,
  content:string | null
}

interface HashImage{
  X:string,
  O:string
}

interface HashCells{
  [row: number]: { [column: number]: number }
}

const hashImage:HashImage={
  "X": imageX,
  "O": imageO
}
const hashCells: HashCells = {
  0: { 0: 0, 1: 1, 2: 2 },
  1: { 0: 3, 1: 4, 2: 5 },
  2: { 0: 6, 1: 7, 2: 8 }
}

function App() {
  const [cells, setCells] = useState<Cell[]>([
    { row: 0, column: 0, content: null },
    { row: 0, column: 1, content: null },
    { row: 0, column: 2, content: null },
    { row: 1, column: 0, content: null },
    { row: 1, column: 1, content: null },
    { row: 1, column: 2, content: null },
    { row: 2, column: 0, content: null },
    { row: 2, column: 1, content: null },
    { row: 2, column: 2, content: null }
  ])
  const isX=useRef<boolean>(false)
  const isThereAWinner=useRef<boolean>(false)
  const amountOfAttempts=useRef<number>(0)
  

  const handleCellClick=async (event:React.MouseEvent<HTMLDivElement, MouseEvent>):Promise<unknown>=>{
    if(isThereAWinner.current){
      const music = new Audio(new URL('./assets/songs/clickNotAllowed.wav', import.meta.url).href);
      await music.play()
      if(isX.current===false){
        alert("Temos um ganhador!! A vitória é do X. Precione F5 para jogar outra partida.")
      }else{
        alert("Temos um ganhador!! A vitória é do O. Precione F5 para jogar outra partida.")
      }
      return
    }
    if(amountOfAttempts.current===9 && isThereAWinner.current===false){
      const music = new Audio(new URL('./assets/songs/clickNotAllowed.wav', import.meta.url).href);
      await music.play()
      alert("Ops,deu velha! Precione F5 para jogar outra partida.")
      return
    }
    const target:HTMLElement=event.target as HTMLElement
    const ID:number=parseInt(target.id)
    if(cells[ID].content==="X" || cells[ID].content==="O"){
      const music = new Audio(new URL('./assets/songs/clickNotAllowed.wav', import.meta.url).href);
      await music.play()
      return
    }
    var currentContent:string=""
    const newCells:Cell[] = cells.map((cell, index) => {
      if(index === ID){
        if(isX.current){
          currentContent="X"
          return { ...cell, content: "X" }
        }else{
          currentContent="O"
          return { ...cell, content: "O" }
        }
      }
      return cell
    })
    setCells(newCells)

    let primaryDiagonalPoints:number=1
    let secondaryDiagonalPoints:number=1
    let xAxisPoints:number=1
    let yAxisPoints:number=1

    let previousRow:number=newCells[ID].row-1
    let previousColumn:number=newCells[ID].column-1
    let nextRow:number=newCells[ID].row+1
    let nextColumn:number=newCells[ID].column+1

    while((previousRow>-1 || nextRow<3) || (previousColumn>-1 || nextColumn<3)){
      console.log(previousColumn,
        nextColumn,
        previousRow,
        nextRow)
      //CALCULA OS EIXOS
      if(previousRow>-1){
        if(newCells[hashCells[previousRow][newCells[ID].column]].content===currentContent){
          yAxisPoints++
        }
      }
      if(nextRow<3){
        if(newCells[hashCells[nextRow][newCells[ID].column]].content===currentContent){
          yAxisPoints++
        }
      }
      if(previousColumn>-1){
        if(newCells[hashCells[newCells[ID].row][previousColumn]].content===currentContent){
          xAxisPoints++
        }
      }
      if(nextColumn<3){
        if(newCells[hashCells[newCells[ID].row][nextColumn]].content===currentContent){
          xAxisPoints++
        }
      }
      //CALCULA AS DIAGONAIS
      if(previousRow>-1){
        if(previousColumn>-1){
          if(newCells[hashCells[previousRow][previousColumn]].content===currentContent){
            primaryDiagonalPoints++
          }
        }
        if(nextColumn<3){
          if(newCells[hashCells[previousRow][nextColumn]].content===currentContent){
            secondaryDiagonalPoints++
          }
        }
      }
      if(nextRow<3){
        if(previousColumn>-1){
          if(newCells[hashCells[nextRow][previousColumn]].content===currentContent){
            secondaryDiagonalPoints++
          }
        }
        if(nextColumn<3){
          if(newCells[hashCells[nextRow][nextColumn]].content===currentContent){
            primaryDiagonalPoints++
          }
        }
      }
      previousColumn--
      nextColumn++
      previousRow--
      nextRow++
    }
    isX.current=!isX.current
    amountOfAttempts.current++
    if(primaryDiagonalPoints===3 || secondaryDiagonalPoints===3 || xAxisPoints===3 || yAxisPoints===3){
      const music = new Audio(new URL('./assets/songs/victory.wav', import.meta.url).href);
      await music.play()
      if(isX.current===false){
        alert("Temos um ganhador!! A vitória é do X. Precione F5 para jogar outra partida.")
      }else{
        alert("Temos um ganhador!! A vitória é do O. Precione F5 para jogar outra partida.")
      }
      isThereAWinner.current=true
      return
    }
    if(amountOfAttempts.current===9 && isThereAWinner.current===false){
      alert("Ops,deu velha! Precione F5 para jogar outra partida.")
    }
    const music = new Audio(new URL('./assets/songs/click.wav', import.meta.url).href);
    await music.play()
  }
  return (
    <>
      <div className='board-game'>
        {
          cells.map((cell, index)=>(
            <div onClick={handleCellClick} className='cell' id={index.toString()} key={index}>
              <div className="cellId">{index}</div>
              {(cell.content==="X" || cell.content==="O") && (
                <img
                  id='imageX'
                  className='cellImage'
                  src={hashImage[cell.content]}
                  alt={cell.content}
                />
              )}
            </div>
          ))
        }
      </div>
    </>
  );
}

export default App;
